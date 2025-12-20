import type { ReactNode } from "react"
import {
    IconAdjustmentsBolt,
    IconBrain,
    IconBriefcase,
    IconCamera,
    IconCloud,
    IconCloudComputingFilled,
    IconCurrencyDollar,
    IconDatabase,
    IconDownload,
    IconEaseInOut,
    IconHeart,
    IconHelp,
    IconHistory,
    IconRouteAltLeft,
    IconSchool,
    IconTerminal2,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export function FeaturesSectionWithHoverEffects() {
    const features = [
        {
            title: "Instant Cloud Architecture",
            description: "Generate AWS, GCP, and Azure diagrams from text.",
            icon: <IconCloudComputingFilled />,
        },
        {
            title: "Research & Logic Maps",
            description: "Turn rough notes into structured logic maps.",
            icon: <IconSchool />,
        },
        {
            title: "Business Process Automation",
            description: "Map onboarding, approvals, and swimlanes fast.",
            icon: <IconBriefcase />,
        },
        {
            title: "Hand-Drawn to Digital",
            description: "Upload a sketch and get an editable draw.io file.",
            icon: <IconCamera />,
        },
        {
            title: "Entity Relationship Diagrams",
            description: "Paste a schema and auto-build relationships.",
            icon: <IconDatabase />,
        },
        {
            title: "Mind Maps from Minutes",
            description: "Summarize transcripts into clean mind maps.",
            icon: <IconBrain />,
        },
        {
            title: "Version Control for Visuals",
            description: "Track revisions and roll back with context.",
            icon: <IconHistory />,
        },
        {
            title: "Export Ready Artifacts",
            description: "Export to PNG, SVG, or draw.io in one click.",
            icon: <IconDownload />,
        },
    ]
    return (
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
                <Feature key={feature.title} {...feature} index={index} />
            ))}
        </div>
    )
}

const Feature = ({
    title,
    description,
    icon,
    index,
}: {
    title: string
    description: string
    icon: ReactNode
    index: number
}) => {
    return (
        <div
            className={cn(
                "group/feature relative flex flex-col py-10 lg:border-r dark:border-neutral-800",
                (index === 0 || index === 4) &&
                    "lg:border-l dark:border-neutral-800",
                index < 4 && "lg:border-b dark:border-neutral-800"
            )}
        >
            {index < 4 && (
                <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
            )}
            {index >= 4 && (
                <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
            )}
            <div className="relative z-10 mb-4 px-10 text-neutral-600 dark:text-neutral-400">
                {icon}
            </div>
            <div className="relative z-10 mb-2 px-10 text-lg font-bold">
                <div className="absolute left-0 inset-y-0 h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-blue-500 dark:bg-neutral-700" />
                <span className="inline-block transition duration-200 group-hover/feature:translate-x-2 text-neutral-800 dark:text-neutral-100">
                    {title}
                </span>
            </div>
            <p className="relative z-10 max-w-xs px-10 text-sm text-neutral-600 dark:text-neutral-300">
                {description}
            </p>
        </div>
    )
}
