import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { PrivacyRightsForm } from '@/components/privacy/PrivacyRightsForm'

/**
 * /privacy/rights — Law 2024/017 data subject rights page.
 * Deletion, export (access + portability), and marketing objection.
 */
export default async function PrivacyRightsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const t = await getTranslations('privacy_rights')
  const { status } = await searchParams

  return (
    <main className="min-h-screen bg-espresso text-cream">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-amber text-[0.78rem] font-medium tracking-[0.1em] uppercase mb-12 hover:opacity-70 transition-opacity"
        >
          {t('back')}
        </Link>

        <h1 className="font-serif2 font-black text-[clamp(2rem,5vw,3.5rem)] text-cream mb-8">
          {t('title')}
        </h1>

        <div className="space-y-10 font-sans font-light text-base leading-[1.8] text-cream/70">
          <p>{t('intro')}</p>

          <section>
            <h2 className="font-sans font-semibold text-cream text-lg mb-3">{t('how_title')}</h2>
            <p>{t('how_body')}</p>
          </section>

          <PrivacyRightsForm status={status} />

          <section>
            <h2 className="font-sans font-semibold text-cream text-lg mb-3">{t('contact_title')}</h2>
            <p>
              {t('contact_body').split('privacy@getkaru.io').map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>{part}<a href="mailto:privacy@getkaru.io" className="text-amber hover:underline">privacy@getkaru.io</a></span>
                ) : part
              )}
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
