'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function FaqSection() {
  const t = useTranslations('faq')
  const [open, setOpen] = useState<number | null>(null)

  const items = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
    { q: t('q5'), a: t('a5') },
    { q: t('q6'), a: t('a6') },
  ]

  return (
    <section id="faq" style={{ background: 'var(--ink)', borderTop: '1px solid var(--gold-line)' }}>
      <div className="max-w-[1240px] mx-auto px-5 md:px-16 py-20 md:py-28">
        <div className="max-w-[720px] mx-auto">
          {/* Header */}
          <div className="reveal text-center mb-14">
            <div className="inline-flex items-center gap-2.5 font-sans text-[0.62rem] font-bold tracking-[0.22em] uppercase mb-4" style={{ color: 'var(--amber)' }}>
              <span className="block w-7 h-px" style={{ background: 'var(--amber)' }} />
              {t('tag')}
              <span className="block w-7 h-px" style={{ background: 'var(--amber)' }} />
            </div>
            <h2 className="font-serif font-light leading-[0.95]" style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)', color: 'var(--cream)' }}>
              {t('heading').replace(t('heading_em'), '')}<em style={{ fontStyle: 'italic', color: 'var(--amber-light)' }}>{t('heading_em')}</em>
            </h2>
          </div>

          {/* Items */}
          {items.map((item, i) => (
            <div key={i} className="reveal" style={{ borderBottom: '1px solid rgba(200,132,26,0.1)' }}>
              <button
                className="w-full flex items-center justify-between py-[22px] font-sans text-[0.95rem] font-medium text-left transition-colors duration-200 focus-visible:outline-none"
                style={{ background: 'none', border: 'none', color: open === i ? 'var(--amber)' : 'var(--cream)', cursor: 'pointer' }}
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                {item.q}
                <span
                  className="ml-5 shrink-0 w-5 h-5 relative transition-transform duration-300"
                  style={{ transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-400 ease-in-out"
                style={{ maxHeight: open === i ? '300px' : '0', paddingBottom: open === i ? '20px' : '0' }}
              >
                <p className="font-serif font-light leading-[1.8]" style={{ fontSize: '0.95rem', color: 'var(--cream-dim)' }}>
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
