'use client'

import { motion } from 'framer-motion'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-espresso flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(232,160,32,0.08) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber/40 rounded-full"
          style={{
            left: `${20 + i * 12}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <motion.div
          className="font-serif2 text-amber text-4xl font-bold tracking-widest mb-8"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          KARU
        </motion.div>

        {/* Animated line */}
        <motion.div
          className="w-16 h-[2px] bg-amber mx-auto mb-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Heading */}
        <h1 className="font-serif text-cream text-[clamp(1.8rem,4vw,2.8rem)] leading-tight mb-4">
          We&apos;ll be right back
        </h1>

        {/* Description */}
        <p className="font-sans font-light text-cream/50 text-base leading-[1.8] mb-8">
          We&apos;re making some improvements. This won&apos;t take long.
        </p>

        {/* Animated spinner */}
        <motion.div
          className="w-8 h-8 border-2 border-amber/30 border-t-amber rounded-full mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="font-sans text-[0.72rem] text-cream/30 tracking-[0.1em]">
          getkaru.io
        </p>
      </div>
    </div>
  )
}
