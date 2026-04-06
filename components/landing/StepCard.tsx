'use client'

import { motion } from 'framer-motion'
import { cardHover } from '@/lib/animations'

interface StepCardProps {
  number: string
  title: string
  description: string
}

export function StepCard({ number, title, description }: StepCardProps) {
  return (
    <motion.div
      className="flex flex-col items-center text-center gap-6"
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      {/* Diamond number icon */}
      <motion.div
        className="w-[52px] h-[52px] border-2 border-amber flex items-center justify-center"
        style={{ rotate: 45 }}
        whileHover={{ rotate: 90 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <span
          className="font-sans font-semibold text-[0.78rem] tracking-[0.1em] text-amber block"
          style={{ transform: 'rotate(-45deg)' }}
        >
          {number}
        </span>
      </motion.div>

      {/* Title */}
      <h3 className="font-serif text-[1.35rem] leading-[1.2] text-cream">
        {title}
      </h3>

      {/* Description */}
      <p className="font-sans font-light text-[0.9rem] leading-[1.8] text-cream/60">
        {description}
      </p>
    </motion.div>
  )
}
