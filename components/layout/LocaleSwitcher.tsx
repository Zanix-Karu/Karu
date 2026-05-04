'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function toggle() {
    const next = locale === 'en' ? 'fr' : 'en'
    const scrollY = window.scrollY
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/'))
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollY, behavior: 'instant' })
    })
  }

  const isEN = locale === 'en'

  return (
    <button
      onClick={toggle}
      aria-label={isEN ? 'Switch to French' : 'Switch to English'}
      className="relative flex items-center gap-0 border border-cream/20 hover:border-amber/50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
    >
      {/* Sliding amber indicator */}
      <span
        className="absolute top-0 bottom-0 w-1/2 bg-amber transition-transform duration-200"
        style={{ transform: isEN ? 'translateX(0%)' : 'translateX(100%)' }}
        aria-hidden="true"
      />
      <span
        className={[
          'relative z-10 px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.14em] font-sans uppercase transition-colors duration-200',
          isEN ? 'text-espresso' : 'text-cream/40',
        ].join(' ')}
      >
        EN
      </span>
      <span
        className={[
          'relative z-10 px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.14em] font-sans uppercase transition-colors duration-200',
          !isEN ? 'text-espresso' : 'text-cream/40',
        ].join(' ')}
      >
        FR
      </span>
    </button>
  )
}
