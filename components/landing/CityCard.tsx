'use client'

import { motion } from 'framer-motion'

interface CityCardProps {
  name: string
  code: string
  coordinates: string
  badge: string
  description: string
  direction: 'left' | 'right'
}

export function CityCard({ name, code, coordinates, badge, description }: CityCardProps) {
  return (
    <motion.div
      className="relative overflow-hidden bg-card-bg border border-card-border p-10 min-h-[320px] flex flex-col justify-between"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Amber glow — appears on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          background: 'radial-gradient(circle at bottom right, rgba(232,160,32,0.3) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Ghost city code */}
      <span
        className="absolute right-0 top-1/2 -translate-y-1/2 font-serif2 font-black text-[10rem] leading-none opacity-[0.025] text-cream select-none pointer-events-none"
        aria-hidden="true"
      >
        {code}
      </span>

      {/* Top content */}
      <div className="relative z-10 flex flex-col gap-4">
        {/* Badge */}
        <div className="inline-flex w-fit items-center gap-2 bg-amber/10 border border-amber/22 px-[14px] py-[5px]">
          <span className="w-1.5 h-1.5 bg-amber rounded-full" aria-hidden="true" />
          <span className="font-sans text-[0.64rem] font-semibold tracking-[0.18em] uppercase text-amber">
            {badge}
          </span>
        </div>

        {/* City name */}
        <h3 className="font-serif2 font-black text-[4rem] leading-none text-cream">
          {name}
        </h3>

        {/* Description */}
        <p className="font-sans font-light text-[0.9rem] leading-[1.8] text-cream/60 max-w-sm">
          {description}
        </p>
      </div>

      {/* Coordinates — bottom right */}
      <div className="relative z-10 flex justify-end mt-8">
        <span className="font-sans text-[0.64rem] tracking-[0.1em] text-cream/30">
          {coordinates}
        </span>
      </div>
    </motion.div>
  )
}
