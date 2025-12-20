import { google } from "@ai-sdk/google"
import {
    APICallError,
    convertToModelMessages,
    createUIMessageStream,
    createUIMessageStreamResponse,
    generateText,
    InvalidToolInputError,
    LoadAPIKeyError,
    type ProviderMetadata,
    stepCountIs,
    streamText,
} from "ai"
import { jsonrepair } from "jsonrepair"
import { z } from "zod"
import { getAIModel, supportsPromptCaching } from "@/lib/ai-providers"
import { findCachedResponse } from "@/lib/cached-responses"
import {
    getTelemetryConfig,
    setTraceInput,
    setTraceOutput,
    wrapWithObserve,
} from "@/lib/langfuse"
import { getSystemPrompt } from "@/lib/system-prompts"

export const maxDuration = 120

// File upload limits (must match client-side)
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const MAX_FILES = 5

// Helper function to validate file parts in messages
function validateFileParts(messages: any[]): {
    valid: boolean
    error?: string
} {
    const lastMessage = messages[messages.length - 1]
    const fileParts =
        lastMessage?.parts?.filter((p: any) => p.type === "file") || []

    if (fileParts.length > MAX_FILES) {
        return {
            valid: false,
            error: `Too many files. Maximum ${MAX_FILES} allowed.`,
        }
    }

    for (const filePart of fileParts) {
        // Data URLs format: data:image/png;base64,<data>
        // Base64 increases size by ~33%, so we check the decoded size
        if (filePart.url?.startsWith("data:")) {
            const base64Data = filePart.url.split(",")[1]
            if (base64Data) {
                const sizeInBytes = Math.ceil((base64Data.length * 3) / 4)
                if (sizeInBytes > MAX_FILE_SIZE) {
                    return {
                        valid: false,
                        error: `File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
                    }
                }
            }
        }
    }

    return { valid: true }
}

// Helper function to check if diagram is minimal/empty
function isMinimalDiagram(xml: string): boolean {
    const stripped = xml.replace(/\s/g, "")
    return !stripped.includes('id="2"')
}

// Helper function to replace historical tool call XML with placeholders
// This reduces token usage and forces LLM to rely on the current diagram XML (source of truth)
// Also fixes invalid/undefined inputs from interrupted streaming
function replaceHistoricalToolInputs(messages: any[]): any[] {
    return messages.map((msg) => {
        if (msg.role !== "assistant" || !Array.isArray(msg.content)) {
            return msg
        }
        const replacedContent = msg.content
            .map((part: any) => {
                if (part.type === "tool-call") {
                    const toolName = part.toolName
                    // Fix invalid/undefined inputs from interrupted streaming
                    if (
                        !part.input ||
                        typeof part.input !== "object" ||
                        Object.keys(part.input).length === 0
                    ) {
                        // Skip tool calls with invalid inputs entirely
                        return null
                    }
                    if (
                        toolName === "display_diagram" ||
                        toolName === "edit_diagram"
                    ) {
                        return {
                            ...part,
                            input: {
                                placeholder:
                                    "[XML content replaced - see current diagram XML in system context]",
                            },
                        }
                    }
                }
                return part
            })
            .filter(Boolean) // Remove null entries (invalid tool calls)
        return { ...msg, content: replacedContent }
    })
}

// Helper function to create cached stream response
function createCachedStreamResponse(xml: string): Response {
    const toolCallId = `cached-${Date.now()}`

    const stream = createUIMessageStream({
        execute: async ({ writer }) => {
            writer.write({ type: "start" })
            writer.write({
                type: "tool-input-start",
                toolCallId,
                toolName: "display_diagram",
            })
            writer.write({
                type: "tool-input-delta",
                toolCallId,
                inputTextDelta: xml,
            })
            writer.write({
                type: "tool-input-available",
                toolCallId,
                toolName: "display_diagram",
                input: { xml },
            })
            writer.write({ type: "finish" })
        },
    })

    return createUIMessageStreamResponse({ stream })
}

// Inner handler function
async function handleChatRequest(req: Request): Promise<Response> {
    // Check for access code
    const accessCodes =
        process.env.ACCESS_CODE_LIST?.split(",")
            .map((code) => code.trim())
            .filter(Boolean) || []
    if (accessCodes.length > 0) {
        const accessCodeHeader = req.headers.get("x-access-code")
        if (!accessCodeHeader || !accessCodes.includes(accessCodeHeader)) {
            return Response.json(
                {
                    error: "Invalid or missing access code. Please configure it in Settings.",
                },
                { status: 401 },
            )
        }
    }

    const { messages, xml, previousXml, sessionId } = await req.json()

    // Get user IP for Langfuse tracking
    const forwardedFor = req.headers.get("x-forwarded-for")
    const userId = forwardedFor?.split(",")[0]?.trim() || "anonymous"

    // Validate sessionId for Langfuse (must be string, max 200 chars)
    const validSessionId =
        sessionId && typeof sessionId === "string" && sessionId.length <= 200
            ? sessionId
            : undefined

    // Extract user input text for Langfuse trace
    const lastMessage = messages[messages.length - 1]
    const userInputText =
        lastMessage?.parts?.find((p: any) => p.type === "text")?.text || ""

    // Update Langfuse trace with input, session, and user
    setTraceInput({
        input: userInputText,
        sessionId: validSessionId,
        userId: userId,
    })

    // === FILE VALIDATION START ===
    const fileValidation = validateFileParts(messages)
    if (!fileValidation.valid) {
        return Response.json({ error: fileValidation.error }, { status: 400 })
    }
    // === FILE VALIDATION END ===

    // === CACHE CHECK START ===
    const isFirstMessage = messages.length === 1
    const isEmptyDiagram = !xml || xml.trim() === "" || isMinimalDiagram(xml)

    if (isFirstMessage && isEmptyDiagram) {
        const lastMessage = messages[0]
        const textPart = lastMessage.parts?.find((p: any) => p.type === "text")
        const filePart = lastMessage.parts?.find((p: any) => p.type === "file")

        const cached = findCachedResponse(textPart?.text || "", !!filePart)

        if (cached) {
            return createCachedStreamResponse(cached.xml)
        }
    }
    // === CACHE CHECK END ===

    // Read client AI provider overrides from headers
    const clientOverrides = {
        provider: req.headers.get("x-ai-provider"),
        baseUrl: req.headers.get("x-ai-base-url"),
        apiKey: req.headers.get("x-ai-api-key"),
        modelId: req.headers.get("x-ai-model"),
    }

    // Read minimal style preference from header
    const minimalStyle = req.headers.get("x-minimal-style") === "true"

    // Get AI model with optional client overrides
    const { model, providerOptions, headers, modelId } =
        getAIModel(clientOverrides)

    // Check if model supports prompt caching
    const shouldCache = supportsPromptCaching(modelId)
    console.log(
        `[Prompt Caching] ${shouldCache ? "ENABLED" : "DISABLED"} for model: ${modelId}`,
    )

    // Get the appropriate system prompt based on model (extended for Opus/Haiku 4.5)
    const systemMessage = getSystemPrompt(modelId, minimalStyle)

    // Extract file parts (images) from the last message
    const fileParts =
        lastMessage.parts?.filter((part: any) => part.type === "file") || []

    // User input only - XML is now in a separate cached system message
    const formattedUserInput = `User input:
"""md
${userInputText}
"""`

    // Convert UIMessages to ModelMessages and add system message
    const modelMessages = convertToModelMessages(messages)

    // DEBUG: Log incoming messages structure
    console.log("[route.ts] Incoming messages count:", messages.length)
    messages.forEach((msg: any, idx: number) => {
        console.log(
            `[route.ts] Message ${idx} role:`,
            msg.role,
            "parts count:",
            msg.parts?.length,
        )
        if (msg.parts) {
            msg.parts.forEach((part: any, partIdx: number) => {
                if (
                    part.type === "tool-invocation" ||
                    part.type === "tool-result"
                ) {
                    console.log(`[route.ts]   Part ${partIdx}:`, {
                        type: part.type,
                        toolName: part.toolName,
                        hasInput: !!part.input,
                        inputType: typeof part.input,
                        inputKeys:
                            part.input && typeof part.input === "object"
                                ? Object.keys(part.input)
                                : null,
                    })
                }
            })
        }
    })

    // Replace historical tool call XML with placeholders to reduce tokens
    // Disabled by default - some models (e.g. minimax) copy placeholders instead of generating XML
    const enableHistoryReplace =
        process.env.ENABLE_HISTORY_XML_REPLACE === "true"
    const placeholderMessages = enableHistoryReplace
        ? replaceHistoricalToolInputs(modelMessages)
        : modelMessages

    // Filter out messages with empty content arrays (Bedrock API rejects these)
    // This is a safety measure - ideally convertToModelMessages should handle all cases
    let enhancedMessages = placeholderMessages.filter(
        (msg: any) =>
            msg.content && Array.isArray(msg.content) && msg.content.length > 0,
    )

    // Filter out tool-calls with invalid inputs (from failed repair or interrupted streaming)
    // Bedrock API rejects messages where toolUse.input is not a valid JSON object
    enhancedMessages = enhancedMessages
        .map((msg: any) => {
            if (msg.role !== "assistant" || !Array.isArray(msg.content)) {
                return msg
            }
            const filteredContent = msg.content.filter((part: any) => {
                if (part.type === "tool-call") {
                    // Check if input is a valid object (not null, undefined, or empty)
                    if (
                        !part.input ||
                        typeof part.input !== "object" ||
                        Object.keys(part.input).length === 0
                    ) {
                        console.warn(
                            `[route.ts] Filtering out tool-call with invalid input:`,
                            { toolName: part.toolName, input: part.input },
                        )
                        return false
                    }
                }
                return true
            })
            return { ...msg, content: filteredContent }
        })
        .filter((msg: any) => msg.content && msg.content.length > 0)

    // DEBUG: Log modelMessages structure (what's being sent to AI)
    console.log("[route.ts] Model messages count:", enhancedMessages.length)
    enhancedMessages.forEach((msg: any, idx: number) => {
        console.log(
            `[route.ts] ModelMsg ${idx} role:`,
            msg.role,
            "content count:",
            msg.content?.length,
        )
        if (msg.content) {
            msg.content.forEach((part: any, partIdx: number) => {
                if (part.type === "tool-call" || part.type === "tool-result") {
                    console.log(`[route.ts]   Content ${partIdx}:`, {
                        type: part.type,
                        toolName: part.toolName,
                        hasInput: !!part.input,
                        inputType: typeof part.input,
                        inputValue:
                            part.input === undefined
                                ? "undefined"
                                : part.input === null
                                  ? "null"
                                  : "object",
                    })
                }
            })
        }
    })

    // Update the last message with user input only (XML moved to separate cached system message)
    if (enhancedMessages.length >= 1) {
        const lastModelMessage = enhancedMessages[enhancedMessages.length - 1]
        if (lastModelMessage.role === "user") {
            // Build content array with user input text and file parts
            const contentParts: any[] = [
                { type: "text", text: formattedUserInput },
            ]

            // Add image parts back
            for (const filePart of fileParts) {
                contentParts.push({
                    type: "image",
                    image: filePart.url,
                    mimeType: filePart.mediaType,
                })
            }

            enhancedMessages = [
                ...enhancedMessages.slice(0, -1),
                { ...lastModelMessage, content: contentParts },
            ]
        }
    }

    // Add cache point to the last assistant message in conversation history
    // This caches the entire conversation prefix for subsequent requests
    // Strategy: system (cached) + history with last assistant (cached) + new user message
    if (shouldCache && enhancedMessages.length >= 2) {
        // Find the last assistant message (should be second-to-last, before current user message)
        for (let i = enhancedMessages.length - 2; i >= 0; i--) {
            if (enhancedMessages[i].role === "assistant") {
                enhancedMessages[i] = {
                    ...enhancedMessages[i],
                    providerOptions: {
                        bedrock: { cachePoint: { type: "default" } },
                    },
                }
                break // Only cache the last assistant message
            }
        }
    }

    // System messages with multiple cache breakpoints for optimal caching:
    // - Breakpoint 1: Static instructions (~1500 tokens) - rarely changes
    // - Breakpoint 2: Current XML context - changes per diagram, but constant within a conversation turn
    // This allows: if only user message changes, both system caches are reused
    //              if XML changes, instruction cache is still reused
    const systemMessages = [
        // Cache breakpoint 1: Instructions (rarely change)
        {
            role: "system" as const,
            content: systemMessage,
            ...(shouldCache && {
                providerOptions: {
                    bedrock: { cachePoint: { type: "default" } },
                },
            }),
        },
        // Cache breakpoint 2: Previous and Current diagram XML context
        {
            role: "system" as const,
            content: `${previousXml ? `Previous diagram XML (before user's last message):\n"""xml\n${previousXml}\n"""\n\n` : ""}Current diagram XML (AUTHORITATIVE - the source of truth):\n"""xml\n${xml || ""}\n"""\n\nIMPORTANT: The "Current diagram XML" is the SINGLE SOURCE OF TRUTH for what's on the canvas right now. The user can manually add, delete, or modify shapes directly in draw.io. Always count and describe elements based on the CURRENT XML, not on what you previously generated. If both previous and current XML are shown, compare them to understand what the user changed. When using edit_diagram, COPY search patterns exactly from the CURRENT XML - attribute order matters!`,
            ...(shouldCache && {
                providerOptions: {
                    bedrock: { cachePoint: { type: "default" } },
                },
            }),
        },
    ]
    // Google Search Grounding Conflict Resolution:
    // The Google provider does not support mixing "provider-defined tools" (googleSearch, thinking) with standard function tools.
    // We must rely on an explicit toggle (or heuristic fallback) to swap toolsets:
    // - "Search Mode": Enable Google Search & Thinking. Disable Diagram tools.
    // - "Diagram Mode": Enable Diagram tools. Disable Google Search & Thinking.

    const isGoogleModel =
        modelId.includes("gemini") || modelId.includes("google")

    // Check for explicit search toggle from client
    const searchEnabledHeader = req.headers.get("x-search-enabled")
    const explicitSearchMode = searchEnabledHeader === "true"
    const explicitDiagramMode = searchEnabledHeader === "false"

    // Fallback heuristic if no header (legacy behavior)
    const heuristicSearchIntent =
        userInputText.toLowerCase().includes("search") ||
        userInputText.toLowerCase().includes("google") ||
        userInputText.toLowerCase().includes("latest") ||
        userInputText.toLowerCase().includes("news") ||
        userInputText.toLowerCase().includes("current event") ||
        userInputText.toLowerCase().includes("weather") ||
        userInputText.toLowerCase().includes("stock price")

    // Decision logic:
    // 1. If explicit header exists, use it.
    // 2. Else use heuristic.
    // 3. MUST be a Google model to enable search.
    const enableGoogleSearch =
        isGoogleModel &&
        (explicitSearchMode ||
            (!explicitDiagramMode &&
                !searchEnabledHeader &&
                heuristicSearchIntent))

    console.log(
        `[route.ts] Tool Selection: GoogleModel=${isGoogleModel}, SearchHeader=${searchEnabledHeader} => EnableSearch=${enableGoogleSearch}`,
    )

    // TWO-STEP WORKFLOW: Search-then-Diagram
    // If search mode is explicitly enabled, we run a two-step orchestration:
    // Step 1: Use gemini-2.5-flash-lite with google_search to gather and summarize info
    // Step 2: Use the user's selected model with diagram tools + the summary as context

    let searchSummary: string | null = null
    let searchGroundingMetadata: any = null

    if (explicitSearchMode) {
        console.log(
            `[route.ts] Search Mode: Running Step 1 (Search with gemini-2.5-flash-lite)...`,
        )
        try {
            const searchResult = await generateText({
                model: google("gemini-2.5-flash-lite"),
                tools: {
                    google_search: google.tools.googleSearch({}),
                } as any, // Type assertion needed for provider-defined tools
                prompt: `Search for information about: "${userInputText}"

Please search and provide a comprehensive summary of the key findings in well-organized bullet points or sections. 
Focus on facts, data, and important details that would be useful for creating a visual diagram or infographic.
Be thorough but concise.`,
            })

            searchSummary = searchResult.text
            searchGroundingMetadata =
                searchResult.providerMetadata?.google?.groundingMetadata
            console.log(
                `[route.ts] Search Step Complete. Summary length: ${searchSummary?.length || 0} chars`,
            )
        } catch (searchError) {
            console.error(`[route.ts] Search Step Failed:`, searchError)
            // Continue without search summary - the diagram model will work with what it has
            searchSummary = `[Search failed. Please proceed with general knowledge about: ${userInputText}]`
        }
    }

    // Build messages for the main model (diagram generation)
    const diagramModeInstruction = searchSummary
        ? `
CURRENT MODE: DIAGRAM WITH RESEARCH CONTEXT
Available Tools: "display_diagram", "edit_diagram", "append_diagram"
Unavailable Tools: "google_search"

RESEARCH SUMMARY (from web search):
${searchSummary}

INSTRUCTIONS:
- Use the research summary above to create an accurate and informative diagram.
- You have diagram tools available to visualize this information.
- Create a professional, well-structured diagram based on the research findings.`
        : `
CURRENT MODE: DIAGRAM / NORMAL
Available Tools: "display_diagram", "edit_diagram", "append_diagram"
Unavailable Tools: "google_search"

INSTRUCTIONS:
- You CANNOT search the web.
- If the user asks to search, explain that you are in Diagram Mode (or that Search is disabled) and cannot access external information right now.`

    const allMessages = [
        ...systemMessages,
        { role: "system", content: diagramModeInstruction },
        ...enhancedMessages,
    ]

    // Always use diagram tools for the main response (search is handled separately in Step 1)
    // Disable thinking when using function tools to avoid provider conflicts
    const runtimeProviderOptions =
        isGoogleModel && providerOptions?.google
            ? {
                  ...providerOptions,
                  google: {
                      ...providerOptions.google,
                      thinkingConfig: undefined,
                  },
              }
            : providerOptions

    // Always use diagram tools - search is handled separately in Step 1 if enabled
    const tools = {
        // Client-side tool that will be executed on the client
        display_diagram: {
            description: `Display a diagram on draw.io. Pass ONLY the mxCell elements - wrapper tags and root cells are added automatically.

VALIDATION RULES (XML will be rejected if violated):
1. Generate ONLY mxCell elements - NO wrapper tags (<mxfile>, <mxGraphModel>, <root>)
2. Do NOT include root cells (id="0" or id="1") - they are added automatically
3. All mxCell elements must be siblings - never nested
4. Every mxCell needs a unique id (start from "2")
5. Every mxCell needs a valid parent attribute (use "1" for top-level)
6. Escape special chars in values: &lt; &gt; &amp; &quot;

Example (generate ONLY this - no wrapper tags):
<mxCell id="lane1" value="Frontend" style="swimlane;" vertex="1" parent="1">
  <mxGeometry x="40" y="40" width="200" height="200" as="geometry"/>
</mxCell>
<mxCell id="step1" value="Step 1" style="rounded=1;" vertex="1" parent="lane1">
  <mxGeometry x="20" y="60" width="160" height="40" as="geometry"/>
</mxCell>
<mxCell id="lane2" value="Backend" style="swimlane;" vertex="1" parent="1">
  <mxGeometry x="280" y="40" width="200" height="200" as="geometry"/>
</mxCell>
<mxCell id="step2" value="Step 2" style="rounded=1;" vertex="1" parent="lane2">
  <mxGeometry x="20" y="60" width="160" height="40" as="geometry"/>
</mxCell>
<mxCell id="edge1" style="edgeStyle=orthogonalEdgeStyle;endArrow=classic;" edge="1" parent="1" source="step1" target="step2">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>

Notes:
- For AWS diagrams, use **AWS 2025 icons**.
- For animated connectors, add "flowAnimation=1" to edge style.
`,
            inputSchema: z.object({
                xml: z
                    .string()
                    .describe("XML string to be displayed on draw.io"),
            }),
        },
        edit_diagram: {
            description: `Edit the current diagram by ID-based operations (update/add/delete cells).

Operations:
- update: Replace an existing cell by its id. Provide cell_id and complete new_xml.
- add: Add a new cell. Provide cell_id (new unique id) and new_xml.
- delete: Remove a cell by its id. Only cell_id is needed.

For update/add, new_xml must be a complete mxCell XML element including mxGeometry.

⚠️ JSON ESCAPING: Every " inside new_xml MUST be escaped as \\". Example: id=\\"5\\" value=\\"Label\\"`,
            inputSchema: z.object({
                operations: z
                    .array(
                        z.object({
                            type: z
                                .enum(["update", "add", "delete"])
                                .describe("Operation type"),
                            cell_id: z
                                .string()
                                .describe(
                                    "The id of the mxCell. Must match the id attribute in new_xml.",
                                ),
                            new_xml: z
                                .string()
                                .optional()
                                .describe(
                                    "Complete mxCell XML element (required for update/add)",
                                ),
                        }),
                    )
                    .describe("Array of operations to apply"),
            }),
        },
        append_diagram: {
            description: `Continue generating diagram XML when previous display_diagram output was truncated due to length limits.

WHEN TO USE: Only call this tool after display_diagram was truncated (you'll see an error message about truncation).

CRITICAL INSTRUCTIONS:
1. Do NOT include any wrapper tags - just continue the mxCell elements
2. Continue from EXACTLY where your previous output stopped
3. Complete the remaining mxCell elements
4. If still truncated, call append_diagram again with the next fragment

Example: If previous output ended with '<mxCell id="x" style="rounded=1', continue with ';" vertex="1">...' and complete the remaining elements.`,
            inputSchema: z.object({
                xml: z
                    .string()
                    .describe(
                        "Continuation XML fragment to append (NO wrapper tags)",
                    ),
            }),
        },
    }

    const result = streamText({
        model,
        ...(process.env.MAX_OUTPUT_TOKENS && {
            maxOutputTokens: parseInt(process.env.MAX_OUTPUT_TOKENS, 10),
        }),
        stopWhen: stepCountIs(5),
        // Repair truncated tool calls when maxOutputTokens is reached mid-JSON
        experimental_repairToolCall: async ({ toolCall, error }) => {
            // DEBUG: Log what we're trying to repair
            console.log(`[repairToolCall] Tool: ${toolCall.toolName}`)
            console.log(
                `[repairToolCall] Error: ${error.name} - ${error.message}`,
            )
            console.log(`[repairToolCall] Input type: ${typeof toolCall.input}`)
            console.log(`[repairToolCall] Input value:`, toolCall.input)

            // Only attempt repair for invalid tool input (broken JSON from truncation)
            if (
                error instanceof InvalidToolInputError ||
                error.name === "AI_InvalidToolInputError"
            ) {
                try {
                    // Pre-process to fix common LLM JSON errors that jsonrepair can't handle
                    let inputToRepair = toolCall.input
                    if (typeof inputToRepair === "string") {
                        // Fix `:=` instead of `: ` (LLM sometimes generates this)
                        inputToRepair = inputToRepair.replace(/:=/g, ": ")
                        // Fix `= "` instead of `: "`
                        inputToRepair = inputToRepair.replace(/=\s*"/g, ': "')
                    }
                    // Use jsonrepair to fix truncated JSON
                    const repairedInput = jsonrepair(inputToRepair)
                    console.log(
                        `[repairToolCall] Repaired truncated JSON for tool: ${toolCall.toolName}`,
                    )
                    return { ...toolCall, input: repairedInput }
                } catch (repairError) {
                    console.warn(
                        `[repairToolCall] Failed to repair JSON for tool: ${toolCall.toolName}`,
                        repairError,
                    )
                    // Return a placeholder input to avoid API errors in multi-step
                    // The tool will fail gracefully on client side
                    if (toolCall.toolName === "edit_diagram") {
                        return {
                            ...toolCall,
                            input: {
                                operations: [],
                                _error: "JSON repair failed - no operations to apply",
                            },
                        }
                    }
                    if (toolCall.toolName === "display_diagram") {
                        return {
                            ...toolCall,
                            input: {
                                xml: "",
                                _error: "JSON repair failed - empty diagram",
                            },
                        }
                    }
                    return null
                }
            }
            // Don't attempt to repair other errors (like NoSuchToolError)
            return null
        },
        messages: allMessages,
        ...(runtimeProviderOptions && {
            providerOptions: runtimeProviderOptions,
        }), // Pass sanitized options
        tools,
        experimental_telemetry: getTelemetryConfig({
            sessionId: validSessionId,
            userId: userId,
        }),
        onFinish: ({ text, usage }) => {
            const anyUsage = usage as any
            setTraceOutput(text, {
                promptTokens: anyUsage.promptTokens ?? anyUsage.inputTokens,
                completionTokens:
                    anyUsage.completionTokens ?? anyUsage.outputTokens,
            })
        },
    })

    return result.toUIMessageStreamResponse({
        sendReasoning: true,
        messageMetadata: ({ part }) => {
            if (part.type === "finish") {
                const usage = (part as any).totalUsage
                if (!usage) {
                    console.warn(
                        "[messageMetadata] No usage data in finish part",
                    )
                    return undefined
                }
                // Total input = non-cached + cached (these are separate counts)
                // Note: cacheWriteInputTokens is not available on finish part
                const totalInputTokens =
                    (usage.inputTokens ?? 0) + (usage.cachedInputTokens ?? 0)

                // Pass provider metadata (including Google search grounding) to client
                // Note: providerMetadata is available in the finish part from streamText
                const providerMetadata = (part as any)
                    .providerMetadata as ProviderMetadata

                return {
                    inputTokens: totalInputTokens,
                    outputTokens: usage.outputTokens ?? 0,
                    finishReason: (part as any).finishReason,
                    providerMetadata,
                }
            }
            return undefined
        },
    })
}

// Helper to categorize errors and return appropriate response
function handleError(error: unknown): Response {
    console.error("Error in chat route:", error)

    const isDev = process.env.NODE_ENV === "development"

    // Check for specific AI SDK error types
    if (APICallError.isInstance(error)) {
        return Response.json(
            {
                error: error.message,
                ...(isDev && {
                    details: error.responseBody,
                    stack: error.stack,
                }),
            },
            { status: error.statusCode || 500 },
        )
    }

    if (LoadAPIKeyError.isInstance(error)) {
        return Response.json(
            {
                error: "Authentication failed. Please check your API key.",
                ...(isDev && {
                    stack: error.stack,
                }),
            },
            { status: 401 },
        )
    }

    // Fallback for other errors with safety filter
    const message =
        error instanceof Error ? error.message : "An unexpected error occurred"
    const status = (error as any)?.statusCode || (error as any)?.status || 500

    // Prevent leaking API keys, tokens, or other sensitive data
    const lowerMessage = message.toLowerCase()
    const safeMessage =
        lowerMessage.includes("key") ||
        lowerMessage.includes("token") ||
        lowerMessage.includes("sig") ||
        lowerMessage.includes("signature") ||
        lowerMessage.includes("secret") ||
        lowerMessage.includes("password") ||
        lowerMessage.includes("credential")
            ? "Authentication failed. Please check your credentials."
            : message

    return Response.json(
        {
            error: safeMessage,
            ...(isDev && {
                details: message,
                stack: error instanceof Error ? error.stack : undefined,
            }),
        },
        { status },
    )
}

// Wrap handler with error handling
async function safeHandler(req: Request): Promise<Response> {
    try {
        return await handleChatRequest(req)
    } catch (error) {
        return handleError(error)
    }
}

// Wrap with Langfuse observe (if configured)
const observedHandler = wrapWithObserve(safeHandler)

export async function POST(req: Request) {
    return observedHandler(req)
}
