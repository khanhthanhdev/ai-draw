"use client"

import { Sparkles } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const TOUR_PROMPT_STORAGE_KEY = "next-ai-draw-io-tour-dismissed"
const DEMO_PROMPT =
    "Create an animated flowchart illustrating the Agile Scrum Sprint Workflow. The animation should visually represent the flow of work and the timing of events."

interface ExamplePanelProps {
    setInput: (input: string) => void
    setFiles: (files: File[]) => void
    onStartTour?: () => void
}

export default function ExamplePanel({
    setInput,
    setFiles,
    onStartTour,
}: ExamplePanelProps) {
    const [isDismissed, setIsDismissed] = useState(() => {
        if (typeof window === "undefined") return false
        return localStorage.getItem(TOUR_PROMPT_STORAGE_KEY) === "true"
    })

    const handleStartTour = () => {
        setInput(DEMO_PROMPT)
        setFiles([])
        localStorage.setItem(TOUR_PROMPT_STORAGE_KEY, "true")
        setIsDismissed(true)
        onStartTour?.()
    }

    const handleDismiss = () => {
        localStorage.setItem(TOUR_PROMPT_STORAGE_KEY, "true")
        setIsDismissed(true)
    }

    if (isDismissed) {
        return (
            <div className="py-8 px-3 animate-fade-in text-center">
                <p className="text-sm text-muted-foreground">
                    Ready to build a diagram? Type a prompt to begin.
                </p>
                <Button
                    type="button"
                    variant="ghost"
                    className="mt-3 rounded-none text-xs"
                    onClick={handleStartTour}
                >
                    Start Product Tour
                </Button>
            </div>
        )
    }

    return (
        <div className="py-8 px-3 animate-fade-in">
            <div className="text-center mb-6">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-none border border-primary/20 bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                    Want a Product Tour?
                </h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    We will guide you through the editor controls step by step.
                </p>
            </div>

            <div className="rounded-none border border-border/60 bg-card p-4 shadow-soft">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Tour highlights
                </p>
                <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside space-y-1">
                    <li>Prompt input and uploads</li>
                    <li>Enhanced prompt and model selection</li>
                    <li>Send, download output, and start a new chat</li>
                </ul>
                <p className="mt-3 text-[11px] text-muted-foreground/70">
                    Demo uses a cached Agile Scrum flowchart prompt for instant
                    results.
                </p>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button
                        type="button"
                        className="rounded-none font-semibold"
                        onClick={handleStartTour}
                    >
                        Start Product Tour
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        className="rounded-none text-foreground/70"
                        onClick={handleDismiss}
                    >
                        No thanks
                    </Button>
                </div>
            </div>
        </div>
    )
}
