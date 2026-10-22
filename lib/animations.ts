import type { Variants } from 'framer-motion'

// Timings copied from the app's motion system
// (karu-app/apps/web/src/ds/motion.css): three durations, two curves.
// Same values as the --motion-* / --ease-* CSS variables in globals.css.
export const DURATION = { fast: 0.12, base: 0.2, slow: 0.32 } as const
/** Decelerate: things arriving. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const
/** A small overshoot for things that land. */
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const

export const motionFast = { duration: DURATION.fast, ease: EASE_OUT } as const
export const motionBase = { duration: DURATION.base, ease: EASE_OUT } as const
export const motionSlow = { duration: DURATION.slow, ease: EASE_OUT } as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0 },
}

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0 },
}

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1 },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

export const cardHover: Variants = {
  rest: { y: 0 },
  hover: { y: -2, transition: motionBase },
}

export const scaleOnTap: Variants = {
  rest: { scale: 1 },
  tap: { scale: 0.96 },
}

export const glowPulse: Variants = {
  rest: { boxShadow: '0 0 0 rgba(251,211,1,0)' },
  hover: { boxShadow: '0 0 30px rgba(251,211,1,0.3)', transition: motionBase },
}

/** Standard viewport trigger options — always use once: true */
export const viewportOnce = { once: true, margin: '-80px' } as const

/** Standard scroll-reveal transition — the app's slow entrance */
export const revealTransition = motionSlow

/** Snappy spring for interactive elements */
export const springTransition = { type: 'spring', stiffness: 300, damping: 20 } as const
