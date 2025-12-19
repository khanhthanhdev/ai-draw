import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { FaGithub } from "react-icons/fa"
import { PricingSection } from "@/components/pricing-section"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { FadeIn } from "@/components/ui/fade-in"

export const metadata: Metadata = {
    title: "About - Clarify",
    description:
        "Landing page for a text to diagram AI platform. Convert prompts to draw.io diagrams fast.",
    keywords: [
        "AI diagram",
        "text to diagram",
        "draw.io",
        "architecture diagrams",
        "workflow mapping",
        "diagram SaaS",
    ],
}

function formatNumber(num: number): string {
    if (num >= 1000) {
        return `${num / 1000}k`
    }
    return num.toString()
}

export default function About() {
    const dailyRequestLimit = Number(process.env.DAILY_REQUEST_LIMIT) || 20
    const dailyTokenLimit = Number(process.env.DAILY_TOKEN_LIMIT) || 500000
    const tpmLimit = Number(process.env.TPM_LIMIT) || 50000

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight"
                    >
                        Clarify
                    </Link>
                    <nav className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        <Link
                            href="/"
                            className="transition hover:text-foreground"
                        >
                            Editor
                        </Link>
                        <Link href="/about" className="text-foreground">
                            About
                        </Link>
                        {/* <a
                            href="https://github.com/DayuanJiang/next-ai-draw-io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 border border-border bg-card px-3 py-2 text-foreground transition hover:-translate-y-0.5 hover:bg-secondary"
                            aria-label="View on GitHub"
                        >
                            <FaGithub className="h-4 w-4" />
                            GitHub
                        </a> */}
                    </nav>
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        <Link href="/about" className="text-foreground">
                            English
                        </Link>
                        <span className="text-muted-foreground/40">|</span>
                        <Link
                            href="/about/vi"
                            className="transition hover:text-foreground"
                        >
                            Tiếng Việt
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
                <section className="relative left-1/2 right-1/2 mt-10 w-screen -translate-x-1/2 border-y border-border overflow-hidden">
                    <AnimatedGridPattern
                        numSquares={30}
                        maxOpacity={0.1}
                        duration={3}
                        repeatDelay={1}
                        className={
                            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 fill-black/[0.02] stroke-black/5 dark:fill-white/[0.02] dark:stroke-white/5"
                        }
                    />
                    <div className="relative mx-auto grid max-w-[1400px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
                        <FadeIn>
                            <div className="flex items-center gap-3">
                                <span className="h-1 w-8 bg-chart-3" />
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                                    Text to diagram AI
                                </p>
                            </div>
                            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                                Build diagrams the same way you describe
                                systems.
                            </h1>
                            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                                Turn plain language into precise draw.io
                                diagrams. Draft architecture, workflows, and
                                data flows in a single prompt, then refine with
                                chat.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center rounded-md border border-primary bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl"
                                >
                                    Open Editor
                                </Link>
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center border border-border bg-secondary px-6 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-secondary/80"
                                >
                                    Try a prompt
                                </Link>
                            </div>
                            <FadeIn
                                delay={0.2}
                                className="mt-8 grid gap-4 sm:grid-cols-3"
                            >
                                <div className="border border-border bg-chart-1/10 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        Draft speed
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold">
                                        Minutes
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        from prompt to diagram
                                    </p>
                                </div>
                                <div className="border border-border bg-chart-2/10 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        Providers
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold">
                                        8+ models
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        bring your own key
                                    </p>
                                </div>
                                <div className="border border-border bg-chart-3/10 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        Outputs
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold">
                                        Draw.io XML
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        export ready
                                    </p>
                                </div>
                            </FadeIn>
                        </FadeIn>
                        <FadeIn delay={0.3} className="grid gap-4">
                            <div className="border border-border bg-secondary p-4">
                                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                    <span>Live prompt</span>
                                    <span className="text-foreground">
                                        AI + draw.io
                                    </span>
                                </div>
                                <p className="mt-4 border border-border bg-card p-4 text-sm text-muted-foreground">
                                    Build an AWS architecture with a web client,
                                    API gateway, workers, and a data lake. Add
                                    animated connectors for the ingestion flow.
                                </p>
                                <div className="mt-4 border border-border bg-card">
                                    <Image
                                        src="/aws_demo.svg"
                                        alt="AI generated AWS architecture diagram"
                                        width={520}
                                        height={360}
                                        className="h-auto w-full"
                                        priority
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="border border-border border-t-4 border-t-chart-2 bg-card p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        Edit loops
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Chat to reshape layouts, labels, and
                                        connectors without touching XML.
                                    </p>
                                </div>
                                <div className="border border-border border-t-4 border-t-chart-4 bg-card p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        History
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Restore any previous version of your
                                        diagram in seconds.
                                    </p>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                <section className="mt-16">
                    <FadeIn>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-3xl font-semibold">
                                    Designed for system thinkers.
                                </h2>
                                <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                                    Convert product plans and architecture
                                    diagrams into artifacts your team can ship
                                    with.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                <span className="border border-border bg-chart-1/15 px-3 py-1 text-foreground">
                                    Open source
                                </span>
                                <span className="border border-border bg-chart-2/15 px-3 py-1 text-foreground">
                                    Self host ready
                                </span>
                                <span className="border border-border bg-chart-3/15 px-3 py-1 text-foreground">
                                    Draw.io native
                                </span>
                            </div>
                        </div>
                    </FadeIn>
                    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <FadeIn delay={0.2} className="h-full">
                            <div className="h-full border border-border border-t-4 border-t-chart-1 bg-card p-6">
                                <h3 className="text-lg font-semibold">
                                    Cloud architecture
                                </h3>
                                <p className="mt-3 text-sm text-muted-foreground">
                                    Generate AWS, GCP, and Azure diagrams with
                                    service icons and clean grouping.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    <span className="border border-border bg-chart-1/10 px-3 py-1">
                                        AWS
                                    </span>
                                    <span className="border border-border bg-chart-2/10 px-3 py-1">
                                        GCP
                                    </span>
                                    <span className="border border-border bg-chart-3/10 px-3 py-1">
                                        Azure
                                    </span>
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.3} className="h-full">
                            <div className="h-full border border-border border-t-4 border-t-chart-2 bg-card p-6">
                                <h3 className="text-lg font-semibold">
                                    Product workflows
                                </h3>
                                <p className="mt-3 text-sm text-muted-foreground">
                                    Outline onboarding, approvals, and data
                                    pipelines in minutes.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    <span className="border border-border bg-chart-2/10 px-3 py-1">
                                        Flows
                                    </span>
                                    <span className="border border-border bg-chart-3/10 px-3 py-1">
                                        Swimlanes
                                    </span>
                                    <span className="border border-border bg-chart-4/10 px-3 py-1">
                                        Journey maps
                                    </span>
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.4} className="h-full">
                            <div className="h-full border border-border border-t-4 border-t-chart-3 bg-card p-6">
                                <h3 className="text-lg font-semibold">
                                    Diagram ops
                                </h3>
                                <p className="mt-3 text-sm text-muted-foreground">
                                    Save every revision, roll back changes, and
                                    keep your context intact.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    <span className="border border-border bg-chart-3/10 px-3 py-1">
                                        Version history
                                    </span>
                                    <span className="border border-border bg-chart-4/10 px-3 py-1">
                                        Export ready
                                    </span>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                <section className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <FadeIn className="h-full">
                        <div className="h-full border border-border border-t-4 border-t-chart-4 bg-card p-8">
                            <h2 className="text-2xl font-semibold">
                                How it works
                            </h2>
                            <div className="mt-6 space-y-5">
                                <div className="flex items-start gap-4">
                                    <span className="flex h-10 w-10 items-center justify-center border border-border bg-primary text-sm font-semibold text-primary-foreground">
                                        1
                                    </span>
                                    <div>
                                        <h3 className="text-base font-semibold">
                                            Describe the outcome
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Start with a prompt or upload a
                                            diagram image.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="flex h-10 w-10 items-center justify-center border border-border bg-primary text-sm font-semibold text-primary-foreground">
                                        2
                                    </span>
                                    <div>
                                        <h3 className="text-base font-semibold">
                                            AI drafts the diagram
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Generate draw.io XML, icons, and
                                            layout instantly.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="flex h-10 w-10 items-center justify-center border border-border bg-primary text-sm font-semibold text-primary-foreground">
                                        3
                                    </span>
                                    <div>
                                        <h3 className="text-base font-semibold">
                                            Refine and export
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Use chat controls, then export SVG,
                                            PNG, or draw.io files.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.2} className="h-full">
                        <div className="h-full border border-border border-t-4 border-t-chart-5 bg-card p-8">
                            <h2 className="text-2xl font-semibold">
                                Feature highlights
                            </h2>
                            <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
                                <li>
                                    LLM powered diagram creation and editing
                                    with natural language prompts.
                                </li>
                                <li>
                                    Image based diagram replication and
                                    enhancement for legacy flows.
                                </li>
                                <li>
                                    Interactive chat interface for precise
                                    layout control.
                                </li>
                                <li>
                                    Animated connectors for data flow
                                    storytelling.
                                </li>
                                <li>
                                    Multi provider support including AWS
                                    Bedrock, OpenAI, Anthropic, Google AI, Azure
                                    OpenAI, Ollama, OpenRouter, and DeepSeek.
                                </li>
                            </ul>
                            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                <span className="border border-border bg-chart-2/10 px-3 py-1">
                                    Chat controls
                                </span>
                                <span className="border border-border bg-chart-3/10 px-3 py-1">
                                    Version history
                                </span>
                                <span className="border border-border bg-chart-4/10 px-3 py-1">
                                    Export ready
                                </span>
                            </div>
                        </div>
                    </FadeIn>
                </section>

                <section className="mt-16">
                    <FadeIn className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-3xl font-semibold">
                                Diagram gallery
                            </h2>
                            <p className="mt-3 text-base text-muted-foreground">
                                Sample outputs from real prompts.
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center border border-border bg-secondary px-4 py-2 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-secondary/80"
                        >
                            Try your own prompt
                        </Link>
                    </FadeIn>
                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <FadeIn delay={0.2}>
                            <div className="border border-border border-t-4 border-t-chart-1 bg-card p-4">
                                <Image
                                    src="/animated_connectors.svg"
                                    alt="Transformer architecture with animated connectors"
                                    width={520}
                                    height={360}
                                    className="h-auto w-full"
                                />
                                <p className="mt-4 text-sm text-muted-foreground">
                                    Animated transformer connectors for clear
                                    data flow storytelling.
                                </p>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.3}>
                            <div className="border border-border border-t-4 border-t-chart-2 bg-card p-4">
                                <Image
                                    src="/gcp_demo.svg"
                                    alt="GCP architecture diagram"
                                    width={520}
                                    height={360}
                                    className="h-auto w-full"
                                />
                                <p className="mt-4 text-sm text-muted-foreground">
                                    GCP infrastructure with concise service
                                    grouping.
                                </p>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.4}>
                            <div className="border border-border border-t-4 border-t-chart-3 bg-card p-4">
                                <Image
                                    src="/azure_demo.svg"
                                    alt="Azure architecture diagram"
                                    width={520}
                                    height={360}
                                    className="h-auto w-full"
                                />
                                <p className="mt-4 text-sm text-muted-foreground">
                                    Azure layout for quick stakeholder reviews.
                                </p>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.5}>
                            <div className="border border-border border-t-4 border-t-chart-4 bg-card p-4">
                                <Image
                                    src="/cat_demo.svg"
                                    alt="Sketch of a cat"
                                    width={320}
                                    height={320}
                                    className="h-auto w-full"
                                />
                                <p className="mt-4 text-sm text-muted-foreground">
                                    Draw sketches, flowcharts, and everything in
                                    between.
                                </p>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                <PricingSection
                    title="Simple pricing"
                    description="Choose the plan that fits your needs."
                    tiers={[
                        {
                            name: "Free",
                            price: "$0",
                            description: "For hobbyists and students.",
                            features: [
                                "Use 0x model",
                                "10 diagrams per month",
                                "Longer queue",
                            ],
                            buttonText: "Get started",
                            href: "/",
                        },
                        {
                            name: "Starter",
                            price: "$3",
                            description: "For occasional use.",
                            features: ["100 credits"],
                            buttonText: "Buy credits",
                            href: "/",
                        },
                        {
                            name: "Pro",
                            price: "$10",
                            description: "For power users.",
                            features: ["500 credits"],
                            buttonText: "Buy credits",
                            href: "/",
                            highlighted: true,
                        },
                    ]}
                />

                <FadeIn className="mt-16 border border-border bg-secondary/60 p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-3xl font-semibold">
                                Usage and transparency
                            </h2>
                            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                                The hosted demo is rate limited to keep service
                                reliable. Use your own API key for higher
                                throughput.
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground"
                        >
                            Configure in settings
                        </Link>
                    </div>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="border border-border bg-chart-1/10 p-5 text-center">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                Token usage
                            </p>
                            <p className="mt-3 text-2xl font-semibold">
                                {formatNumber(tpmLimit)}
                                <span className="text-sm font-normal text-muted-foreground">
                                    /min
                                </span>
                            </p>
                            <p className="text-lg font-semibold">
                                {formatNumber(dailyTokenLimit)}
                                <span className="text-sm font-normal text-muted-foreground">
                                    /day
                                </span>
                            </p>
                        </div>
                        <div className="border border-border bg-chart-2/10 p-5 text-center">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                Daily requests
                            </p>
                            <p className="mt-3 text-3xl font-semibold">
                                {dailyRequestLimit}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                requests
                            </p>
                        </div>
                        <div className="border border-border bg-chart-3/10 p-5 text-center">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                Bring your key
                            </p>
                            <p className="mt-3 text-sm text-muted-foreground">
                                Configure your provider and API key in the chat
                                settings. Keys stay local to your browser.
                            </p>
                        </div>
                    </div>
                </FadeIn>

                {/* <FadeIn className="mt-16 border border-border bg-card p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-3xl font-semibold">
                                Open source and community backed
                            </h2>
                            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                                Fork the project, run it privately, or support
                                the hosted demo. Every sponsor keeps the service
                                running.
                            </p>
                            <p className="mt-3 text-sm text-muted-foreground">
                                For questions or support, open an issue on the
                                GitHub repository or contact: me[at]jiang.jp
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <iframe
                                src="https://github.com/sponsors/DayuanJiang/button"
                                title="Sponsor DayuanJiang"
                                height="32"
                                width="114"
                                style={{ border: 0 }}
                            />
                            <a
                                href="https://github.com/DayuanJiang/next-ai-draw-io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center border border-border bg-secondary px-4 py-2 text-sm font-semibold text-foreground"
                            >
                                View repository
                            </a>
                        </div>
                    </div>
                </FadeIn> */}

                <FadeIn className="mt-16 border border-border bg-gradient-to-r from-primary via-chart-3 to-destructive p-8 text-primary-foreground">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-3xl font-semibold">
                                Ready to sketch in seconds?
                            </h2>
                            <p className="mt-3 max-w-2xl text-base text-primary-foreground/80">
                                Start with a prompt, refine with chat, and ship
                                diagrams that teams can act on.
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center border border-background bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
                        >
                            Open the editor
                        </Link>
                    </div>
                </FadeIn>
            </main>

            <footer className="border-t border-border bg-background">
                <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
                    Clarify - See what you mean.
                </div>
            </footer>
        </div>
    )
}
