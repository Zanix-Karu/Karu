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

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

export const cardHover: Variants = {
  rest: { y: 0 },
  hover: { y: -8, transition: { duration: 0.35, ease: 'easeOut' } },
}

/** Standard viewport trigger options — always use once: true */
export const viewportOnce = { once: true, margin: '-80px' } as const

/** Standard scroll-reveal transition */
export const revealTransition = { duration: 0.7, ease: [0.16, 1, 0.3, 1] } as const
