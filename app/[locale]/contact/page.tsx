import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function ContactPage() {
  const t = useTranslations('contact')

  return (
    <main className="min-h-screen bg-espresso text-cream flex items-center">
      <div className="max-w-2xl mx-auto px-6 py-24 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-amber text-[0.78rem] font-medium tracking-[0.1em] uppercase mb-12 hover:opacity-70 transition-opacity"
        >
          {t('back')}
        </Link>

        <h1 className="font-serif2 font-black text-[clamp(2rem,5vw,3.5rem)] text-cream mb-4">
          {t('title')}
        </h1>
        <p className="font-sans font-light text-cream/60 text-base leading-[1.8] mb-12">
          {t('description')}
        </p>

        <div className="space-y-6">
          <div className="bg-card-bg border border-card-border rounded-lg p-6">
            <p className="text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-amber mb-2">{t('general_label')}</p>
            <a href="mailto:hello@getkaru.io" className="font-sans text-cream hover:text-amber transition-colors text-lg">
              hello@getkaru.io
            </a>
          </div>

          <div className="bg-card-bg border border-card-border rounded-lg p-6">
            <p className="text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-amber mb-2">{t('vendor_label')}</p>
            <a href="mailto:vendors@getkaru.io" className="font-sans text-cream hover:text-amber transition-colors text-lg">
              vendors@getkaru.io
            </a>
          </div>

          <div className="bg-card-bg border border-card-border rounded-lg p-6">
            <p className="text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-amber mb-2">{t('social_label')}</p>
            <a
              href="https://instagram.com/getkaru.io"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-cream hover:text-amber transition-colors text-lg"
            >
              {t('instagram_handle')}
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
