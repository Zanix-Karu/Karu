'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

export function AnimatedHeroContent() {
  const t = useTranslations('hero')
  const shouldReduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const handleVendorCTA = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
    window.dispatchEvent(new CustomEvent('zanix:vendor-preselect'))
  }

  return (
    <motion.div
      className="relative z-10 flex flex-col items-center"
      variants={container}
      initial={mounted && !shouldReduce ? 'hidden' : false}
      animate="visible"
    >
      {/* Badge */}
      <motion.div variants={item} className="mb-9">
        <div
          className="inline-flex items-center gap-[9px] rounded-full px-[18px] py-[6px] font-sans text-[0.62rem] font-bold tracking-[0.22em] uppercase"
          style={{ background: 'rgba(200,132,26,0.08)', border: '1px solid rgba(200,132,26,0.22)', color: 'var(--amber)' }}
        >
          <span className="w-[5px] h-[5px] rounded-full animate-blink" style={{ background: 'var(--amber)' }} />
          {t('badge')}
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        variants={item}
        className="font-serif font-light leading-[0.86] tracking-[-0.025em] mb-7"
        style={{ fontSize: 'clamp(4rem, 9.5vw, 10rem)', color: 'var(--cream)' }}
      >
        <strong className="block font-semibold">{t('title_line1')}</strong>
        <em className="block not-italic" style={{ color: 'var(--amber-light)', fontStyle: 'italic', fontWeight: 300 }}>{t('title_line2')}</em>
      </motion.h1>

      {/* Sub */}
      <motion.p
        variants={item}
        className="font-serif font-light mb-11 max-w-lg"
        style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.9rem)', color: 'var(--cream-dim)' }}
      >
        {t('sub')}
      </motion.p>

      {/* CTAs */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-16">
        <a
          href="#waitlist"
          className="inline-flex items-center justify-center font-sans text-[0.75rem] font-bold tracking-[0.12em] uppercase px-10 py-[14px] transition-all duration-200 hover:-translate-y-[2px] active:translate-y-0"
          style={{ background: 'var(--amber)', color: 'var(--ink)' }}
        >
          {t('cta_primary')}
        </a>
        <a
          href="#waitlist"
          onClick={handleVendorCTA}
          className="inline-flex items-center justify-center font-sans text-[0.75rem] font-medium tracking-[0.12em] uppercase px-10 py-[14px] transition-all duration-200 hover:-translate-y-[2px] active:translate-y-0"
          style={{ background: 'transparent', color: 'var(--cream-dim)', border: '1px solid var(--cream-faint)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--amber)'; (e.currentTarget as HTMLElement).style.color = 'var(--amber)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--cream-faint)'; (e.currentTarget as HTMLElement).style.color = 'var(--cream-dim)' }}
        >
          {t('cta_secondary')}
        </a>
      </motion.div>

      {/* Mock app window */}
      <motion.div
        variants={item}
        className="w-full max-w-[680px]"
        style={{ filter: 'drop-shadow(0 20px 80px rgba(0,0,0,0.5)) drop-shadow(0 0 60px rgba(200,132,26,0.08))' }}
      >
        <div style={{ background: 'var(--mahogany)', border: '1px solid var(--glass-warm-border)', borderRadius: '16px', overflow: 'hidden' }}>
          {/* Chrome bar */}
          <div className="flex items-center gap-2 px-4 py-3" style={{ background: 'var(--cognac)', borderBottom: '1px solid var(--gold-line)' }}>
            <div className="w-[10px] h-[10px] rounded-full" style={{ background: '#FF5F57' }} />
            <div className="w-[10px] h-[10px] rounded-full" style={{ background: '#FEBC2E' }} />
            <div className="w-[10px] h-[10px] rounded-full" style={{ background: '#28C840' }} />
            <div className="flex-1 mx-3 rounded-md px-3 py-1 text-center font-sans text-[0.62rem] tracking-[0.04em]" style={{ background: 'rgba(240,232,216,0.06)', border: '1px solid var(--gold-line)', color: 'var(--cream-dim)' }}>
              app.karu.rentals · Douala
            </div>
          </div>
          {/* Mock app content */}
          <div className="p-6">
            {/* Search bar */}
            <div className="flex items-center gap-3 rounded-[10px] px-[18px] py-3 mb-5" style={{ background: 'rgba(240,232,216,0.05)', border: '1px solid var(--gold-line)' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--amber)', flexShrink: 0 }}>
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="font-sans text-[0.75rem] tracking-[0.02em]" style={{ color: 'var(--cream-dim)' }}>Search verified cars in Douala...</span>
              <span className="ml-auto font-sans text-[0.65rem] font-semibold tracking-[0.08em]" style={{ color: 'var(--amber)' }}>📍 Douala Airport</span>
            </div>
            {/* Car cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Toyota Camry', type: 'Sedan · 2022', price: '25K XAF', rating: '4.8' },
                { name: 'Land Cruiser', type: '4×4 · 7 Seats', price: '55K XAF', rating: '4.9', highlight: true },
                { name: 'RAV4', type: 'SUV · A/C', price: '38K XAF', rating: '4.7' },
              ].map((car) => (
                <div
                  key={car.name}
                  className="rounded-[10px] p-3"
                  style={{
                    background: car.highlight ? 'rgba(200,132,26,0.06)' : 'var(--cognac)',
                    border: `1px solid ${car.highlight ? 'rgba(200,132,26,0.5)' : 'var(--gold-line)'}`,
                  }}
                >
                  <div className="w-full h-14 rounded-md mb-2 flex items-center justify-center" style={{ background: car.highlight ? 'rgba(200,132,26,0.12)' : 'var(--leather)' }}>
                    <svg width="60" height="26" viewBox="0 0 60 26" fill="none">
                      <path d="M4 20L8 10C9 7 12 6 16 6L30 5L44 6C48 6 51 7 52 10L56 20Z" fill="var(--mahogany)" stroke="rgba(200,132,26,0.2)" strokeWidth="0.5"/>
                      <circle cx="12" cy="21" r="4" fill="var(--ink)" stroke="rgba(200,132,26,0.3)" strokeWidth="0.5"/>
                      <circle cx="48" cy="21" r="4" fill="var(--ink)" stroke="rgba(200,132,26,0.3)" strokeWidth="0.5"/>
                      <ellipse cx="5" cy="16" rx="3" ry="1.5" fill="rgba(200,132,26,0.5)"/>
                    </svg>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded px-[6px] py-[2px] mb-1 font-sans text-[0.55rem] font-bold tracking-[0.08em] uppercase" style={{ background: 'rgba(200,132,26,0.12)', color: 'var(--amber)' }}>✓ Verified</div>
                  <div className="font-sans text-[0.68rem] font-semibold mb-0.5" style={{ color: 'var(--cream)' }}>{car.name}</div>
                  <div className="font-sans text-[0.58rem] mb-2" style={{ color: 'var(--cream-dim)' }}>{car.type}</div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[0.7rem] font-bold" style={{ color: 'var(--amber)' }}>{car.price}</span>
                    <span className="font-sans text-[0.58rem]" style={{ color: 'var(--cream-dim)' }}>★ {car.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
