'use client'

import { Fragment } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

const LOCALES = ['en', 'fr'] as const

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(next: string) {
    if (next === locale) return

    // Preserve scroll position
    const scrollY = window.scrollY

    // Replace locale segment in pathname: /en/... → /fr/...
    const segments = pathname.split('/')
    segments[1] = next
    const newPath = segments.join('/')

    router.push(newPath)

    // Restore scroll after navigation
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollY, behavior: 'instant' })
    })
  }

  return (
    <div
      className="flex items-center gap-1 font-sans text-[0.72rem] font-semibold tracking-[0.12em] uppercase"
      role="group"
      aria-label="Language switcher"
    >
      {LOCALES.map((l, i) => (
        <Fragment key={l}>
          <button
            onClick={() => switchLocale(l)}
            aria-pressed={locale === l}
            aria-label={`Switch to ${l === 'en' ? 'English' : 'French'}`}
            className={[
              'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber',
              locale === l ? 'text-amber' : 'text-cream/40 hover:text-cream/70',
            ].join(' ')}
          >
            {l.toUpperCase()}
          </button>
          {i < LOCALES.length - 1 && (
            <span className="text-cream/20" aria-hidden="true">
              /
            </span>
          )}
        </Fragment>
      ))}
    </div>
  )
}
