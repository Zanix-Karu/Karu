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
      className="group relative overflow-hidden bg-card-bg border border-card-border px-6 py-10 md:px-10 md:py-[52px]"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Top amber bar — CSS-only so SSR renders it at scale-x-0 (no hydration flash) */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-amber origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[450ms] ease-out" />

      {/* Hover gradient shift overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(232,160,32,0.04) 0%, transparent 50%, rgba(232,160,32,0.02) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Ghost number — scales up on hover */}
      <span
        className="absolute bottom-0 right-2 font-serif2 text-[8rem] font-black opacity-[0.05] text-cream select-none pointer-events-none leading-none transition-transform duration-500 ease-out group-hover:scale-110 origin-bottom-right"
        aria-hidden="true"
      >
        {ghostNumber}
      </span>

      {/* Icon */}
      <div className="relative z-10 mb-5">
        <div className="w-11 h-11 rounded-lg bg-amber/10 flex items-center justify-center">
          <IconComponent size={22} className="text-amber" />
        </div>
      </div>

      {/* Label */}
      <p className="relative z-10 font-sans font-semibold text-[0.72rem] tracking-[0.2em] uppercase text-amber mb-3">
        {label}
      </p>

      {/* Description */}
      <p className="relative z-10 font-sans font-light text-[0.9rem] leading-[1.8] text-cream/60">
        {description}
      </p>
    </motion.div>
  )
}
