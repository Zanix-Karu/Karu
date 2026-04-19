import { useTranslations } from 'next-intl'
import { Ticker } from '@/components/ui/Ticker'

export function TickerBand() {
  const t = useTranslations('ticker')
  const phrases = [
    t('phrase_1'), t('phrase_2'), t('phrase_3'), t('phrase_4'),
    t('phrase_5'), t('phrase_6'), t('phrase_7'), t('phrase_8'),
  ]
  return (
    <div style={{ background: 'var(--amber)', overflow: 'hidden', padding: '13px 0' }}>
      <Ticker
        items={phrases}
        className="font-sans text-[0.64rem] font-bold tracking-[0.14em] uppercase"
        style={{ color: 'var(--ink)' }}
      />
    </div>
  )
}
