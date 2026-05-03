'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const NAV_LINKS = [
  { key: 'about', href: '#about' },
  { key: 'how_it_works', href: '#how-it-works' },
  { key: 'features', href: '#features' },
  { key: 'cities', href: '#cities' },
] as const

export function Navigation() {
  const t = useTranslations('nav')
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        stuck
          ? 'bg-espresso/90 backdrop-blur-md border-b border-cream/[0.06] py-3'
          : 'bg-transparent py-5',
      ].join(' ')}
    >
      <nav
        className="max-w-7xl mx-auto px-6 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="#hero"
          className="font-serif2 text-[1.35rem] font-bold text-amber tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
          aria-label="Karu — back to top"
        >
          Karu
        </a>

        {/* Nav links — hidden below 900px */}
        <ul className="hidden min-[900px]:flex items-center gap-8" role="list">
          {NAV_LINKS.map(({ key, href }) => (
            <li key={key}>
              <a
                href={href}
                className="font-sans text-[0.78rem] font-medium tracking-[0.1em] uppercase text-cream/60 hover:text-cream transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
              >
                {t(key)}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#waitlist"
          className="relative overflow-hidden inline-flex items-center justify-center font-sans text-[0.85rem] font-semibold tracking-[0.07em] uppercase transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-espresso bg-amber text-espresso px-7 py-[11px] hover:-translate-y-[2px] hover:shadow-[0_12px_35px_rgba(232,160,32,0.35)] active:scale-[0.98] text-[0.75rem]"
        >
          {t('cta')}
        </a>
      </nav>
    </header>
  )
}
