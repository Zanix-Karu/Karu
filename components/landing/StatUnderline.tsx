'use client'

import { motion } from 'framer-motion'

export function StatUnderline() {
  return (
    <motion.div
      className="h-[2px] bg-amber rounded-full origin-left"
      initial={{ width: 0 }}
      whileInView={{ width: 40 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      aria-hidden="true"
    />
  )
}
