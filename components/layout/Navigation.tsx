'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { LocaleSwitcher } from './LocaleSwitcher'
import { APP_URL } from '@/lib/site-url'

const NAV_LINKS = [
  { key: 'about', href: '#about' },
  { key: 'how_it_works', href: '#how-it-works' },
  { key: 'features', href: '#features' },
  { key: 'cities', href: '#cities' },
] as const

/** The `min-[900px]` breakpoint the links use, as a number for matchMedia. */
const DESKTOP_NAV_PX = 900

export function Navigation() {
  const t = useTranslations('nav')
  const [stuck, setStuck] = useState(false)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = useCallback((returnFocus = false) => {
    setOpen(false)
    // Focus returns to the button only when the user dismissed the panel
    // (Escape / the toggle / the backdrop). Following a link leaves it alone.
    if (returnFocus) toggleRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(true)
    }
    document.addEventListener('keydown', onKeyDown)

    // Resizing up to the desktop layout would otherwise leave an open panel
    // stranded next to the links it duplicates.
    const mq = window.matchMedia(`(min-width: ${DESKTOP_NAV_PX}px)`)
    const onBreakpoint = () => {
      if (mq.matches) setOpen(false)
    }
    mq.addEventListener('change', onBreakpoint)

    // The panel and its backdrop cover the viewport; letting the page scroll
    // behind them is disorienting on touch.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Land keyboard and screen-reader users inside the panel they just opened.
    panelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      mq.removeEventListener('change', onBreakpoint)
      document.body.style.overflow = previousOverflow
    }
  }, [open, close])

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          stuck || open
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
            aria-label="Karu back to top"
          >
            Karu
          </a>

          {/* Nav links — hidden below 900px, where the panel takes over */}
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
            {/*
              The booking app is live and bookable, but nothing on this site
              pointed at it. Amber marks the one link that leaves the page.
            */}
            <li>
              <a
                href={APP_URL}
                className="font-sans text-[0.78rem] font-medium tracking-[0.1em] uppercase text-amber/90 hover:text-amber transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
              >
                {t('browse_cars')}
              </a>
            </li>
          </ul>

          {/* CTA + locale toggle + mobile menu button */}
          <div className="flex items-center gap-2 min-[900px]:gap-3">
            <LocaleSwitcher />
            <a
              href="#waitlist"
              className="relative overflow-hidden inline-flex items-center justify-center font-sans text-[0.85rem] font-semibold tracking-[0.07em] uppercase transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-espresso bg-amber text-espresso px-4 min-[900px]:px-7 py-[11px] hover:-translate-y-[2px] hover:shadow-[0_12px_35px_rgba(251,211,1,0.35)] active:scale-[0.98] text-[0.75rem] nav-cta-pulse"
            >
              {t('cta')}
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => (open ? close(true) : setOpen(true))}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? t('menu_close') : t('menu_open')}
              className="min-[900px]:hidden inline-flex items-center justify-center w-11 h-11 -mr-3 text-cream/70 hover:text-cream transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {open ? (
                  <>
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="7" x2="21" y2="7" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="17" x2="21" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/*
          Mobile panel. Sits immediately after the toggle in the DOM, so it is a
          plain disclosure: Tab moves straight into it and Escape closes it — no
          focus trap needed for four anchors.
        */}
        {open && (
          <div
            id="mobile-nav"
            ref={panelRef}
            className="min-[900px]:hidden border-t border-cream/[0.06] bg-espresso/95 backdrop-blur-md nav-panel-in"
          >
            <ul className="max-w-7xl mx-auto px-6 py-2" role="list">
              {NAV_LINKS.map(({ key, href }) => (
                <li key={key} className="border-b border-cream/[0.05] last:border-b-0">
                  <a
                    href={href}
                    onClick={() => close()}
                    className="block py-4 font-sans text-[0.82rem] font-medium tracking-[0.1em] uppercase text-cream/70 hover:text-cream transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                  >
                    {t(key)}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={APP_URL}
                  onClick={() => close()}
                  className="block py-4 font-sans text-[0.82rem] font-medium tracking-[0.1em] uppercase text-amber hover:text-amber/80 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                >
                  {t('browse_cars')}
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/*
        Backdrop. Must live OUTSIDE the header: `backdrop-blur` on the header
        makes it the containing block for fixed descendants, so a nested
        `fixed inset-0` would size to the header and collapse to nothing.
        z-40 keeps it under the header (z-50) but over the page.
      */}
      {open && (
        <div
          role="presentation"
          aria-hidden="true"
          onClick={() => close(true)}
          className="fixed inset-0 z-40 bg-espresso/70 backdrop-blur-sm min-[900px]:hidden"
        />
      )}
    </>
  )
}
