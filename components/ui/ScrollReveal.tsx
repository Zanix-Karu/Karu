'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, fadeLeft, fadeRight, viewportOnce, revealTransition } from '@/lib/animations'

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: 'up' | 'left' | 'right'
  delay?: number
  className?: string
}

const variantMap = { up: fadeUp, left: fadeLeft, right: fadeRight }

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  className,
}: ScrollRevealProps) {
  const shouldReduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const variants = variantMap[direction]

  return (
    <motion.div
      variants={variants}
      // Before hydration: show content immediately (no opacity:0 flash)
      // After hydration: animate from hidden on scroll
      initial={mounted && !shouldReduce ? 'hidden' : false}
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ ...revealTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
