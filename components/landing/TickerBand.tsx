import { useTranslations } from 'next-intl'
import { Ticker } from '@/components/ui/Ticker'

export function TickerBand() {
  const t = useTranslations('ticker')

  const phrases = [
    t('phrase_1'),
    t('phrase_2'),
    t('phrase_3'),
    t('phrase_4'),
    t('phrase_5'),
    t('phrase_6'),
    t('phrase_7'),
    t('phrase_8'),
  ]

  return (
    <section className="w-full bg-amber py-4">
      <Ticker
        items={phrases}
        className="font-sans font-bold uppercase text-espresso tracking-widest text-sm"
      />
    </section>
  )
}
