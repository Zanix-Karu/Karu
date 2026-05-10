'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'

/** Stagger config: 120ms between items, 100ms initial delay */
const heroContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const heroItem = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export function AnimatedHeroContent() {
  const t = useTranslations('hero')
  const shouldReduce = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  /** Mouse parallax — only on pointer:fine, disabled when reduced motion */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (shouldReduce) return
      const grid = document.getElementById('hero-grid')
      if (!grid) return

      const { innerWidth: w, innerHeight: h } = window
      // Normalise to [-1, 1]
      const nx = (e.clientX / w - 0.5) * 2
      const ny = (e.clientY / h - 0.5) * 2
      // Max ±20px, 0.4× damping
      const x = nx * 20 * 0.4
      const y = ny * 20 * 0.4
      grid.style.transform = `translate(${x}px, ${y}px)`
    },
    [shouldReduce],
  )

  useEffect(() => {
    // Only attach on pointer:fine devices
    const mq = window.matchMedia('(pointer: fine)')
    if (!mq.matches || shouldReduce) return

    const section = sectionRef.current
    if (!section) return

    section.addEventListener('mousemove', handleMouseMove as EventListener)
    return () => {
      section.removeEventListener('mousemove', handleMouseMove as EventListener)
      // Reset grid position on unmount
      const grid = document.getElementById('hero-grid')
      if (grid) grid.style.transform = ''
    }
  }, [handleMouseMove, shouldReduce])

  /** Scroll to waitlist AND pre-select vendor type */
  const handleVendorCTA = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
    window.dispatchEvent(new CustomEvent('karu:vendor-preselect'))
  }

  const containerVariants = shouldReduce ? {} : heroContainer
  const itemVariants = shouldReduce ? {} : heroItem

  return (
    <div ref={sectionRef} className="absolute inset-0 flex flex-col items-center justify-center">
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-[900px] mx-auto"
        variants={containerVariants}
        initial={mounted && !shouldReduce ? 'hidden' : false}
        animate="visible"
      >
        {/* ── Animated pill badge ── */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="inline-flex items-center gap-2 bg-amber/10 border border-amber/[0.22] px-[18px] py-[7px] rounded-full">
            <span className="w-1.5 h-1.5 bg-amber rounded-full animate-pulse" />
            <span className="text-[0.72rem] font-medium tracking-[0.18em] uppercase text-amber">
              {t('pill')}
            </span>
          </div>
        </motion.div>

        {/* ── Headline — Playfair Display 900 ── */}
        <motion.h1
          variants={itemVariants}
          className="font-serif2 font-black leading-[0.95] tracking-tight text-white mb-4"
          style={{ fontSize: 'clamp(3.4rem, 9vw, 8.5rem)' }}
        >
          <span className="block">{t('title_line1')}</span>
          <span className="block text-amber">{t('title_line2')}</span>
          <span className="block">{t('title_line3')}</span>
        </motion.h1>

        {/* ── Eyebrow ── */}
        <motion.p
          variants={itemVariants}
          className="font-sans font-semibold text-[0.72rem] tracking-[0.18em] uppercase text-amber mb-5"
        >
          {t('eyebrow')}
        </motion.p>

        {/* ── Description ── */}
        <motion.p
          variants={itemVariants}
          className="font-sans font-light text-cream/70 text-base leading-[1.8] max-w-[560px] mb-10"
        >
          {t('description')}
        </motion.p>

        {/* ── CTAs ── */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0 mb-6"
        >
          <a
            href="#waitlist"
            className="w-full sm:w-auto relative overflow-hidden inline-flex items-center justify-center font-sans text-[0.85rem] font-semibold tracking-[0.07em] uppercase transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-espresso bg-amber text-espresso px-8 py-[14px] hover:-translate-y-[3px] hover:shadow-[0_18px_55px_rgba(232,160,32,0.4)] active:scale-[0.98]"
          >
            {t('cta_primary')}
          </a>
          <a
            href="#waitlist"
            className="w-full sm:w-auto relative overflow-hidden inline-flex items-center justify-center font-sans text-[0.85rem] font-medium tracking-[0.07em] uppercase transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-espresso bg-transparent text-cream border border-cream/20 px-8 py-[14px] hover:border-amber hover:text-amber hover:-translate-y-[3px] active:scale-[0.98]"
            onClick={handleVendorCTA}
          >
            {t('cta_secondary')}
          </a>
        </motion.div>

        {/* ── Social proof counter ── */}
        <HeroWaitlistCount />
      </motion.div>
    </div>
  )
}


// ── Social proof: live waitlist count in hero ─────────────────────────────────

function HeroWaitlistCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/waitlist/count')
      .then(r => r.json())
      .then(d => { if (d?.data?.count) setCount(d.data.count) })
      .catch(() => {})
  }, [])

  if (!count || count < 3) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.2 }}
      className="flex items-center gap-2 text-cream/40 text-[0.78rem]"
    >
      <div className="flex -space-x-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full border-2 border-espresso bg-amber/20 flex items-center justify-center"
          >
            <span className="text-[0.5rem] text-amber font-bold">{['K', 'A', 'R'][i]}</span>
          </div>
        ))}
      </div>
      <span className="font-sans">
        <span className="text-amber font-semibold">{count}+</span> already on the waitlist
      </span>
    </motion.div>
  )
}
