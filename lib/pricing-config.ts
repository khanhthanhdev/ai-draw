export type PlanTier = "FREE" | "BASE" | "STANDARD" | "PRO"

export type PlanMultipliers = Record<PlanTier, number>

export interface ModelPricing {
    id: string
    name: string
    provider: string
    multiplier: number
}

export interface PricingConfig {
    baseCreditUsd: number
    planMultipliers: PlanMultipliers
    freePlanMonthlyCreditLimit: number
    models: ModelPricing[]
}

const DEFAULT_BASE_CREDIT_USD = 0.03
const DEFAULT_PLAN_MULTIPLIERS: PlanMultipliers = {
    FREE: 0.0,
    BASE: 0.5,
    STANDARD: 1.0,
    PRO: 2.0,
}
const DEFAULT_FREE_PLAN_MONTHLY_CREDIT_LIMIT = 0

export const MODEL_PRICING: ModelPricing[] = [
    {
        id: "gemini-3-flash-preview",
        name: "Gemini 3 Flash Preview",
        provider: "google",
        multiplier: 1,
    },
    {
        id: "gemini-3-pro-preview",
        name: "Gemini 3 Pro Preview",
        provider: "google",
        multiplier: 5,
    },
    {
        id: "gemini-2.5-flash-lite",
        name: "Gemini 2.5 Flash Lite",
        provider: "google",
        multiplier: 0.33,
    },
    {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        provider: "google",
        multiplier: 0.5,
    },
    {
        id: "xiaomi/mimo-v2-flash:free",
        name: "Xiaomi Mimo V2",
        provider: "openrouter",
        multiplier: 0,
    },
    {
        id: "mistralai/devstral-2512:free",
        name: "Mistral DevStral",
        provider: "openrouter",
        multiplier: 0,
    },
    {
        id: "moonshotai/kimi-k2:free",
        name: "Moonshot Kimi K2",
        provider: "openrouter",
        multiplier: 0,
    },
]

function parseNumberWithDefault(
    value: string | undefined,
    fallback: number,
    name: string,
): number {
    if (value === undefined || value.trim() === "") {
        return fallback
    }
    const parsed = Number(value)
    if (!Number.isFinite(parsed) || parsed < 0) {
        throw new Error(`${name} must be a non-negative number`)
    }
    return parsed
}

export function getPricingConfig(): PricingConfig {
    return {
        baseCreditUsd: parseNumberWithDefault(
            process.env.BASE_CREDIT_USD,
            DEFAULT_BASE_CREDIT_USD,
            "BASE_CREDIT_USD",
        ),
        planMultipliers: {
            FREE: parseNumberWithDefault(
                process.env.PLAN_MULTIPLIER_FREE,
                DEFAULT_PLAN_MULTIPLIERS.FREE,
                "PLAN_MULTIPLIER_FREE",
            ),
            BASE: parseNumberWithDefault(
                process.env.PLAN_MULTIPLIER_BASE,
                DEFAULT_PLAN_MULTIPLIERS.BASE,
                "PLAN_MULTIPLIER_BASE",
            ),
            STANDARD: parseNumberWithDefault(
                process.env.PLAN_MULTIPLIER_STANDARD,
                DEFAULT_PLAN_MULTIPLIERS.STANDARD,
                "PLAN_MULTIPLIER_STANDARD",
            ),
            PRO: parseNumberWithDefault(
                process.env.PLAN_MULTIPLIER_PRO,
                DEFAULT_PLAN_MULTIPLIERS.PRO,
                "PLAN_MULTIPLIER_PRO",
            ),
        },
        freePlanMonthlyCreditLimit: parseNumberWithDefault(
            process.env.FREE_PLAN_MONTHLY_CREDIT_LIMIT,
            DEFAULT_FREE_PLAN_MONTHLY_CREDIT_LIMIT,
            "FREE_PLAN_MONTHLY_CREDIT_LIMIT",
        ),
        models: MODEL_PRICING,
    }
}

export function getUnitPriceUsd(
    plan: PlanTier,
    config: PricingConfig = getPricingConfig(),
): number {
    return config.baseCreditUsd * config.planMultipliers[plan]
}

export function getModelMultiplier(modelId: string): number {
    return MODEL_PRICING.find((model) => model.id === modelId)?.multiplier ?? 1
}
