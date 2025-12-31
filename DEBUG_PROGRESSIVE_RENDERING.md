# Debugging Progressive Diagram Rendering

## Recent Fixes (2025-12-31)

### 1. Fixed Race Condition in `editDiagramOriginalXmlRef`
**Location:** `components/chat-message-display.tsx:630-638`

**Problem:** If `chartXML` was empty when streaming started, the ref would store an empty string, causing all operations to fail.

**Fix:** Added fallback to minimal diagram structure:
```typescript
const baseXml = chartXML ||
    `<mxfile><diagram name="Page-1" id="page-1"><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel></diagram></mxfile>`
editDiagramOriginalXmlRef.current.set(toolCallId, baseXml)
```

### 2. Improved `isMxCellXmlComplete` with Incomplete Tag Detection
**Location:** `lib/utils.ts:43-90`

**Problem:** Only checked if XML ended with `/>` or `</mxCell>`, missing partial opening tags like `<mxCell id="2" width=`

**Fix:** Added explicit incomplete pattern detection:
- Detects incomplete `<mxCell>`, `<mxGeometry>`, `<mxPoint>`, `<Array>` tags
- Checks for incomplete quoted attribute values
- Validates opening/closing tag pairs
- Defaults to incomplete for safety

### 3. Added Unmount Cleanup for Debounce Timeouts
**Location:** `components/chat-message-display.tsx:738-751`

**Problem:** Debounce timeouts could fire on stale closures after component unmounted.

**Fix:** Added separate `useEffect` with empty deps for unmount-only cleanup:
```typescript
useEffect(() => {
    return () => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
            debounceTimeoutRef.current = null
        }
        if (editDebounceTimeoutRef.current) {
            clearTimeout(editDebounceTimeoutRef.current)
            editDebounceTimeoutRef.current = null
        }
    }
}, []) // Empty deps = cleanup runs only on unmount
```

### 4. Added Parser Fallback for `extractCompleteMxCells`
**Location:** `lib/utils.ts:158-252`

**Problem:** Regex approach could fail with unusual XML structure or whitespace.

**Fix:** Added `extractCompleteMxCellsWithParser` fallback that uses string parsing instead of regex:
- Finds complete `<mxCell>` elements sequentially
- Handles self-closing and nested tags
- More robust for edge cases
- Wrapped main function in try-catch to use fallback on regex failure

## 1. Location of `wrapWithMxFile`

The function `wrapWithMxFile` is correctly defined and exported in `@/lib/utils.ts` (lines 286+).

```typescript
export function wrapWithMxFile(xml: string): string {
    const ROOT_CELLS = '<mxCell id="0"/><mxCell id="1" parent="0"/>'
    // ... (logic to wrap bare cells or partial XML in <mxfile><diagram>...)
}
```

It is imported and used in:
- `hooks/use-diagram-tool-handlers.ts`
- `components/chat-panel.tsx`

`components/chat-message-display.tsx` does **not** import it directly; instead, it uses `replaceNodes` to merge streamed cells into an existing `mxfile` structure, which is the correct approach for progressive updates.

## 2. Progressive Rendering in `chat-message-display.tsx`

The progressive rendering logic is implemented in the `handleDisplayChart` function and the `useEffect` hook that monitors message updates.

### `handleDisplayChart`
This function handles both streaming updates and final rendering:

**Streaming Path (`showToast = false`):**
1. **Extraction:** Uses `extractCompleteMxCells(currentXml)` to discard incomplete trailing `<mxCell>` tags.
2. **Conversion:** Calls `convertToLegalXml` to ensure the extracted fragment is valid XML (e.g., closing open tags).
3. **Merging:** Uses `replaceNodes(baseXML, convertedXml)` to inject the new cells into the diagram's `baseXML`.
4. **Rendering:** Calls `onDisplayChart` to update the diagram view.
5. **Validation:** Skips heavy validation (`validateAndFixXml`) to maintain low latency.

**Final Path (`showToast = true`):**
1. **Extraction/Conversion:** Same as above.
2. **Validation:** Runs `validateAndFixXml` to perform thorough checks and auto-fixes.
3. **Rendering:** Updates the diagram with the validated/fixed XML.
4. **Feedback:** Shows error toasts if validation fails.

### `useEffect` Wiring
A `useEffect` hook (around line 532) connects the streaming tool input to `handleDisplayChart`:
- **State `input-streaming` / `input-available`:** Debounces calls to `handleDisplayChart(xml, false)`.
- **State `output-available`:** Immediately calls `handleDisplayChart(xml, true)` for the final render.

**Conclusion:** The implementation correctly supports progressive rendering by incrementally processing complete cells and debouncing updates.

## 3. Robustness of `extractCompleteMxCells`

The `extractCompleteMxCells` function (in `lib/utils.ts`) uses regex to find `<mxCell>` blocks:

```typescript
const selfClosingPattern = /<mxCell\s+[^>]*\/>/g
const nestedPattern = /<mxCell\s+[^>]*>[\s\S]*?<\/mxCell>/g
```

- **Behavior:** It extracts self-closing cells and cells with nested content (like `<mxGeometry>` or `<mxPoint>`).
- **Nesting:** It relies on the assumption that `<mxCell>` tags are **siblings** and not nested within each other. This is enforced by `validateMxCellStructure` elsewhere.
- **Fragility:** If the stream cuts off *inside* an opening tag, the regex won't match, which is desired (the incomplete cell is ignored until the next chunk).

**Verdict:** The regex approach is acceptable given the constraint that `mxCell` elements are siblings.

## 4. `use-diagram-tool-handlers.ts` and `partialXmlRef`

The `useDiagramToolHandlers` hook manages **tool execution**, not the streaming UI preview.

- **`partialXmlRef`:** Used to accumulate XML when the model's output is truncated (stopped due to token limits). It allows stitching together a full diagram from multiple `display_diagram` + `append_diagram` calls.
- **Separation of Concerns:** `partialXmlRef` is **not** used in `chat-message-display.tsx`. The streaming UI logic (preview) and the tool execution logic (final commit/continuation) operate independently.
- **Interference:** There is no interference. The streaming preview uses `pendingXmlRef` and `debounceTimeoutRef`, while the tool handler uses `partialXmlRef`.

## 5. Potential Issues & Improvements

While the logic is sound, here are potential edge cases to watch for:

1.  **Model Output Format:**
    - If the model emits wrapper tags (e.g., `<root>`, `<mxGraphModel>`) instead of bare `<mxCell>`s, `isMxCellXmlComplete` might misclassify the XML as incomplete because it expects the string to end with `/>` or `</mxCell>`.
    - **Fix:** Harden `isMxCellXmlComplete` to handle wrapper tags if this becomes a common issue.

2.  **Consistency:**
    - The streaming path uses `replaceNodes`, while the final tool execution uses `wrapWithMxFile`.
    - **Improvement:** Ensure `wrapWithMxFile` logic aligns with how `replaceNodes` expects the structure, or unify the logic if visual glitches occur between the last stream chunk and the final render.

3.  **`extractCompleteMxCells` Robustness:**
    - If unusual whitespace or attributes break the regex, consider switching to a parser-based approach (using `parseXmlTags` stack logic) to identify complete elements more reliably.
