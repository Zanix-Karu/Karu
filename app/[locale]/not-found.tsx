import Link from 'next/link'
import { buttonClass } from '@/components/ui/button-styles'
import { useTranslations } from 'next-intl'

/**
 * Locale-scoped 404.
 *
 * The root `app/not-found.tsx` cannot render: this app has no `app/layout.tsx`
 * (it uses Next's multiple-root-layouts pattern — `[locale]`, `admin` and
 * `maintenance` each supply their own <html>), and a root not-found has no
 * layout to live in. Since next-intl rewrites every unmatched path to
 * `/<locale>/…`, real 404s land here instead, inside a layout that works.
 */
export default function LocaleNotFound() {
  const t = useTranslations('not_found')

  return (
    <div className="min-h-screen bg-espresso flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-amber text-7xl font-serif mb-4">404</div>
        <h1 className="text-cream text-xl font-semibold mb-3">{t('title')}</h1>
        <p className="text-cream/50 text-base font-light mb-8 leading-relaxed">
          {t('body')}
        </p>
        <Link
          href="/"
          className={buttonClass('primary')}
        >
          {t('cta')}
        </Link>
      </div>
    </div>
  )
}
