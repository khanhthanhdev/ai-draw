import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    /* config options here */
    output: "standalone",
    outputFileTracingIncludes: {
        "*": ["./instrumentation.ts"],
    },
}

export default nextConfig
