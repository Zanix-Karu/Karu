import type { Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0 },
}

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0 },
}

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0 },
}

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
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
  hover: { y: -8, transition: { duration: 0.35, ease: 'easeOut' } },
}

export const scaleOnTap: Variants = {
  rest: { scale: 1 },
  tap: { scale: 0.96 },
}

export const glowPulse: Variants = {
  rest: { boxShadow: '0 0 0 rgba(232,160,32,0)' },
  hover: { boxShadow: '0 0 30px rgba(232,160,32,0.3)' },
}

/** Standard viewport trigger options — always use once: true */
export const viewportOnce = { once: true, margin: '-80px' } as const

/** Standard scroll-reveal transition — smooth cubic bezier */
export const revealTransition = { duration: 0.7, ease: [0.16, 1, 0.3, 1] } as const

/** Snappy spring for interactive elements */
export const springTransition = { type: 'spring', stiffness: 300, damping: 20 } as const
