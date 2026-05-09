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
      className="group flex flex-col items-center text-center gap-6"
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      {/* Diamond number icon with glow on hover */}
      <motion.div
        className="relative w-[52px] h-[52px] border-2 border-amber flex items-center justify-center"
        style={{ rotate: 45 }}
        whileHover={{ rotate: 90, scale: 1.1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {/* Glow behind diamond */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: '0 0 20px rgba(232,160,32,0.4)', transform: 'scale(1.5)' }}
          aria-hidden="true"
        />
        <span
          className="font-sans font-semibold text-[0.78rem] tracking-[0.1em] text-amber block"
          style={{ transform: 'rotate(-45deg)' }}
        >
          {number}
        </span>
      </motion.div>

      {/* Title */}
      <h3 className="font-serif text-[1.35rem] leading-[1.2] text-cream group-hover:text-amber transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="font-sans font-light text-[0.9rem] leading-[1.8] text-cream/60">
        {description}
      </p>
    </motion.div>
  )
}
