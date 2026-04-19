import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function TermsPage() {
  const t = useTranslations('terms')

  return (
    <main className="min-h-screen bg-espresso text-cream">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-amber text-[0.78rem] font-medium tracking-[0.1em] uppercase mb-12 hover:opacity-70 transition-opacity"
        >
          {t('back')}
        </Link>

        <h1 className="font-serif2 font-black text-[clamp(2rem,5vw,3.5rem)] text-cream mb-4">
          {t('title')}
        </h1>
        <p className="text-cream/40 text-[0.78rem] mb-12">{t('updated')}</p>

        <div className="space-y-10 font-sans font-light text-base leading-[1.8] text-cream/70">
          {(['s1','s2','s3','s4','s5','s6'] as const).map((s) => (
            <section key={s}>
              <h2 className="font-sans font-semibold text-cream text-lg mb-3">{t(`${s}_title`)}</h2>
              <p>
                {t(`${s}_body`).split('hello@getkaru.io').map((part, i, arr) =>
                  i < arr.length - 1 ? (
                    <span key={i}>{part}<a href="mailto:hello@getkaru.io" className="text-amber hover:underline">hello@getkaru.io</a></span>
                  ) : part
                )}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
