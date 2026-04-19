'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const NAV_LINKS = [
  { key: 'how_it_works', href: '#how' },
  { key: 'trust',        href: '#trust' },
  { key: 'cities',       href: '#cities' },
  { key: 'faq',          href: '#faq' },
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        'flex items-center justify-between px-6 md:px-16',
        stuck
          ? 'bg-ink/88 backdrop-blur-xl border-b py-[18px]'
          : 'bg-transparent border-b border-transparent py-7',
      ].join(' ')}
      style={{ borderColor: stuck ? 'var(--gold-line)' : 'transparent' }}
    >
      {/* Logo */}
      <a
        href="#"
        className="font-serif text-[1.55rem] font-medium text-cream tracking-[0.02em] hover:opacity-80 transition-opacity"
        aria-label="Karu — back to top"
      >
        <em className="not-italic text-amber">K</em>aru
      </a>

      {/* Nav links — hidden on mobile */}
      <ul className="hidden md:flex items-center gap-10" role="list">
        {NAV_LINKS.map(({ key, href }) => (
          <li key={key}>
            <a
              href={href}
              className="font-sans text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-cream/55 hover:text-amber transition-colors duration-200"
            >
              {t(key)}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="#waitlist"
        className="font-sans text-[0.68rem] font-bold tracking-[0.14em] uppercase bg-amber text-ink px-[26px] py-[11px] hover:bg-amber-light transition-colors duration-200 hover:-translate-y-px active:translate-y-0"
      >
        {t('cta')}
      </a>
    </header>
  )
}
