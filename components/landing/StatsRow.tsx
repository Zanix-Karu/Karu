import { useTranslations } from 'next-intl'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { StatUnderline } from './StatUnderline'

interface StatCell {
  valueKey: string
  labelKey: string
  target?: number
  suffix?: string
  isStatic?: boolean
}

const STATS: StatCell[] = [
  { valueKey: 'vendors_value', labelKey: 'vendors_label', target: 500, suffix: '+' },
  { valueKey: 'cities_value',  labelKey: 'cities_label',  target: 2 },
  { valueKey: 'verified_value', labelKey: 'verified_label', target: 100, suffix: '%' },
  { valueKey: 'support_value', labelKey: 'support_label', isStatic: true },
]

export function StatsRow() {
  const t = useTranslations('stats')

  return (
    <section
      aria-label="Platform statistics"
      className="bg-brown-dark min-h-screen flex items-center"
    >
      <div className="w-full grid grid-cols-2 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <ScrollReveal
            key={stat.labelKey}
            delay={i * 0.1}
            className={[
              'flex flex-col items-center justify-center gap-3 px-4 py-10 md:px-8 md:py-14 text-center',
              i < 3 ? 'md:border-r md:border-cream/10' : '',
              i % 2 === 0 && i < 3 ? 'border-r border-cream/10' : '',
              i < 2 ? 'border-b border-cream/10 md:border-b-0' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {/* Number */}
            <div className="font-serif2 font-black text-[2.4rem] md:text-[3.2rem] leading-none text-cream">
              {stat.isStatic ? (
                <span>{t(stat.valueKey)}</span>
              ) : (
                <AnimatedCounter
                  target={stat.target!}
                  suffix={stat.suffix}
                  duration={1800}
                />
              )}
            </div>

            {/* Amber underline */}
            <StatUnderline />

            {/* Label */}
            <p className="font-sans text-[0.78rem] font-medium tracking-[0.08em] uppercase text-cream/60">
              {t(stat.labelKey)}
            </p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
