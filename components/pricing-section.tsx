"use client"

import { Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/ui/fade-in"

interface PricingTier {
    name: string
    price: string
    description: string
    features: string[]
    buttonText: string
    href: string
    highlighted?: boolean
}

interface PricingSectionProps {
    title: string
    description: string
    tiers: PricingTier[]
}

export function PricingSection({
    title,
    description,
    tiers,
}: PricingSectionProps) {
    return (
        <section className="py-24 sm:py-32">
            <FadeIn>
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="text-base font-semibold leading-7 text-primary">
                            Pricing
                        </h2>
                        <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                            {title}
                        </p>
                    </div>
                    <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-muted-foreground">
                        {description}
                    </p>
                    <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
                        {tiers.map((tier) => (
                            <div
                                key={tier.name}
                                className={`flex flex-col justify-between rounded-3xl p-8 ring-1 xl:p-10 ${
                                    tier.highlighted
                                        ? "bg-primary text-primary-foreground ring-primary"
                                        : "bg-card ring-border"
                                }`}
                            >
                                <div>
                                    <h3
                                        id={tier.name}
                                        className={`text-sm font-semibold leading-6 ${
                                            tier.highlighted
                                                ? "text-primary-foreground"
                                                : "text-foreground"
                                        }`}
                                    >
                                        {tier.name}
                                    </h3>
                                    <p className="mt-4 flex items-baseline gap-x-2">
                                        <span
                                            className={`text-4xl font-bold tracking-tight ${tier.highlighted ? "text-primary-foreground" : "text-foreground"}`}
                                        >
                                            {tier.price}
                                        </span>
                                    </p>
                                    <p
                                        className={`mt-6 text-sm leading-6 ${
                                            tier.highlighted
                                                ? "text-primary-foreground/80"
                                                : "text-muted-foreground"
                                        }`}
                                    >
                                        {tier.description}
                                    </p>
                                    <ul
                                        className={`mt-8 space-y-3 text-sm leading-6 ${
                                            tier.highlighted
                                                ? "text-primary-foreground/90"
                                                : "text-muted-foreground"
                                        }`}
                                    >
                                        {tier.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex gap-x-3"
                                            >
                                                <Check
                                                    className={`h-6 w-5 flex-none ${
                                                        tier.highlighted
                                                            ? "text-primary-foreground"
                                                            : "text-primary"
                                                    }`}
                                                    aria-hidden="true"
                                                />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Button
                                    asChild
                                    variant={
                                        tier.highlighted
                                            ? "secondary"
                                            : "outline"
                                    }
                                    className={`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                                        tier.highlighted
                                            ? "bg-background text-foreground hover:bg-background/90"
                                            : ""
                                    }`}
                                >
                                    <Link href={tier.href}>
                                        {tier.buttonText}
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </FadeIn>
        </section>
    )
}
