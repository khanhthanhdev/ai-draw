"use client"

import { driver } from "driver.js"
import { useCallback, useEffect, useRef } from "react"

const TOUR_SELECTORS = {
    input: "[data-tour='prompt-input']",
    upload: "[data-tour='upload-files']",
    enhance: "[data-tour='enhance-prompt']",
    model: "[data-tour='model-selector']",
    send: "[data-tour='send-button']",
    download: "[data-tour='download-output']",
    newChat: "[data-tour='new-chat']",
}

const TOUR_TARGETS = Object.values(TOUR_SELECTORS)

const TOUR_TARGET_TIMEOUT_MS = 1200
const TOUR_TARGET_RETRY_MS = 120

async function waitForTourTargets(): Promise<void> {
    const maxTries = Math.ceil(TOUR_TARGET_TIMEOUT_MS / TOUR_TARGET_RETRY_MS)
    for (let attempt = 0; attempt < maxTries; attempt += 1) {
        const ready = TOUR_TARGETS.every((selector) =>
            document.querySelector(selector),
        )
        if (ready) return
        await new Promise((resolve) =>
            setTimeout(resolve, TOUR_TARGET_RETRY_MS),
        )
    }
}

function getTourSteps() {
    let sendClickHandler: (() => void) | null = null

    return [
        {
            element: TOUR_SELECTORS.input,
            popover: {
                title: "Start with a prompt",
                description:
                    "Describe the diagram you want. The demo prompt is prefilled for a fast, cached result.",
                side: "top" as const,
                align: "start" as const,
            },
        },
        {
            element: TOUR_SELECTORS.upload,
            popover: {
                title: "Upload files or images",
                description:
                    "Add images, PDFs, or text files to guide the diagram generation.",
                side: "top" as const,
                align: "center" as const,
            },
        },
        {
            element: TOUR_SELECTORS.enhance,
            popover: {
                title: "Enhance your prompt",
                description:
                    "Let AI rewrite your prompt for clarity and structure.",
                side: "top" as const,
                align: "center" as const,
            },
        },
        {
            element: TOUR_SELECTORS.model,
            popover: {
                title: "Choose a model",
                description:
                    "Pick the model that best fits the diagram quality or speed you want.",
                side: "bottom" as const,
                align: "start" as const,
            },
        },
        {
            element: TOUR_SELECTORS.send,
            popover: {
                title: "Send to generate",
                description:
                    "Click Send to generate the cached animated diagram and see the results.",
                side: "top" as const,
                align: "center" as const,
                showButtons: ["previous", "close"] as (
                    | "next"
                    | "previous"
                    | "close"
                )[],
            },
            onHighlightStarted: (
                element: Element | undefined,
                _step: any,
                { driver }: { driver: any },
            ) => {
                if (!element) return
                const target = element as HTMLElement
                sendClickHandler = () => {
                    window.setTimeout(() => {
                        driver.moveNext()
                    }, 250)
                }
                target.addEventListener("click", sendClickHandler, {
                    once: true,
                })
            },
            onDeselected: (element: Element | undefined) => {
                if (element && sendClickHandler) {
                    element.removeEventListener("click", sendClickHandler)
                }
                sendClickHandler = null
            },
        },
        {
            element: TOUR_SELECTORS.download,
            popover: {
                title: "Download output",
                description:
                    "Save the diagram as PNG, SVG, or draw.io XML when you are ready.",
                side: "top" as const,
                align: "center" as const,
            },
        },
        {
            element: TOUR_SELECTORS.newChat,
            popover: {
                title: "Start a new chat",
                description:
                    "Reset the conversation anytime to start a fresh diagram.",
                side: "left" as const,
                align: "center" as const,
            },
        },
    ]
}

export function useEditorTour() {
    const driverRef = useRef<ReturnType<typeof driver> | null>(null)

    useEffect(() => {
        return () => {
            driverRef.current?.destroy()
            driverRef.current = null
        }
    }, [])

    const startTour = useCallback(async () => {
        if (typeof window === "undefined") return

        if (driverRef.current?.isActive()) {
            driverRef.current.destroy()
            driverRef.current = null
        }

        const driverObj = driver({
            showProgress: true,
            progressText: "Step {{current}} of {{total}}",
            showButtons: ["next", "previous", "close"],
            overlayOpacity: 0.45,
            stagePadding: 8,
            popoverOffset: 10,
            steps: getTourSteps(),
            onDestroyed: () => {
                driverRef.current = null
            },
        })

        driverRef.current = driverObj
        await waitForTourTargets()
        driverObj.drive()
    }, [])

    return { startTour }
}
