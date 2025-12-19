"use client"

import { type HTMLMotionProps, motion, useInView } from "framer-motion"
import { useRef } from "react"

interface FadeInProps extends HTMLMotionProps<"div"> {
    delay?: number
    duration?: number
    yOffset?: number
}

export function FadeIn({
    children,
    className,
    delay = 0,
    duration = 0.5,
    yOffset = 24,
    ...props
}: FadeInProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: yOffset }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
            transition={{
                duration,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}
