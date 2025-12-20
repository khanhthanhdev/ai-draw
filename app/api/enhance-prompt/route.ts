import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { z } from "zod"

const MODEL_ID = "gemini-2.5-flash-lite"

const bodySchema = z.object({
    prompt: z.string().trim().min(1).max(4000),
})

const SYSTEM_PROMPT = [
    "You enhance diagram prompts.",
    "Expand the user's request into a longer, more specific prompt.",
    "Add relevant ideas, entities, relationships, constraints, and edge cases.",
    "Include layout, grouping, labeling, and styling cues when helpful.",
    "Prefer concrete nouns, clear relationships, and explicit structure.",
    "If file excerpts are provided, weave in 1-3 key details without copying large chunks.",
    "Return only the enhanced prompt text. No preamble, no labels, no quotes.",
].join(" ")

function validateAccessCode(req: Request): Response | null {
    const accessCodes =
        process.env.ACCESS_CODE_LIST?.split(",")
            .map((code) => code.trim())
            .filter(Boolean) || []

    if (accessCodes.length === 0) {
        return null
    }

    const accessCodeHeader = req.headers.get("x-access-code")
    if (!accessCodeHeader || !accessCodes.includes(accessCodeHeader)) {
        return Response.json(
            {
                error: "Invalid or missing access code. Please configure it in Settings.",
            },
            { status: 401 },
        )
    }

    return null
}

export async function POST(req: Request) {
    const accessError = validateAccessCode(req)
    if (accessError) return accessError

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return Response.json(
            {
                error: "Google API key is not configured for prompt enhancement.",
            },
            { status: 500 },
        )
    }

    let body: z.infer<typeof bodySchema>
    try {
        body = bodySchema.parse(await req.json())
    } catch {
        return Response.json(
            { error: "Invalid request body for prompt enhancement." },
            { status: 400 },
        )
    }

    try {
        const result = await generateText({
            model: google(MODEL_ID),
            system: SYSTEM_PROMPT,
            prompt: body.prompt,
            temperature: 0.5,
        })

        return Response.json({
            enhancedPrompt: result.text.trim(),
            model: MODEL_ID,
        })
    } catch (error) {
        console.error("Prompt enhancement failed:", error)
        return Response.json(
            { error: "Failed to enhance prompt. Please try again." },
            { status: 500 },
        )
    }
}
