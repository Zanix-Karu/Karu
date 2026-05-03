'use client'

import { motion } from 'framer-motion'
import {
  IconShield, IconCreditCard,
  IconPlane, IconStar, IconCar, IconChat,
} from '@/components/ui/Icon'

interface FeatureCardProps {
  icon: string
  label: string
  description: string
  index: number
}

const ICONS = [IconShield, IconCreditCard, IconPlane, IconStar, IconCar, IconChat]

export function FeatureCard({ label, description, index }: FeatureCardProps) {
  const ghostNumber = String(index + 1).padStart(2, '0')
  const IconComponent = ICONS[index % ICONS.length]

  return (
    <motion.div
      className="relative overflow-hidden bg-card-bg border border-card-border px-6 py-10 md:px-10 md:py-[52px]"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Top amber bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px] bg-amber origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{ originX: 0 }}
      />

      {/* Ghost number */}
      <span
        className="absolute bottom-0 right-2 font-serif2 text-[8rem] font-black opacity-[0.05] text-cream select-none pointer-events-none leading-none"
        aria-hidden="true"
      >
        {ghostNumber}
      </span>

      {/* Icon */}
      <div className="mb-5">
        <div className="w-11 h-11 rounded-lg bg-amber/10 flex items-center justify-center">
          <IconComponent size={22} className="text-amber" />
        </div>
      </div>

      {/* Label */}
      <p className="font-sans font-semibold text-[0.72rem] tracking-[0.2em] uppercase text-amber mb-3">
        {label}
      </p>

      {/* Description */}
      <p className="font-sans font-light text-[0.9rem] leading-[1.8] text-cream/60">
        {description}
      </p>
    </motion.div>
  )
}
