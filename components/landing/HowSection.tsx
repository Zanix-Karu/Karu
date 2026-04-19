import { useTranslations } from 'next-intl'

const STEP_CARDS = [
  // Step 1 — booking card
  (
    <div key="s1" className="rounded-xl p-5 w-full" style={{ background: 'rgba(13,9,5,0.85)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-warm-border)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-serif text-base font-medium" style={{ color: 'var(--cream)' }}>Toyota Camry · 2022</span>
        <span className="font-sans text-[0.6rem] font-bold tracking-[0.12em] uppercase px-[10px] py-1 rounded-full" style={{ background: 'rgba(200,132,26,0.15)', color: 'var(--amber)' }}>Available</span>
      </div>
      {[['Pickup', 'Douala Airport'], ['Duration', '4 days'], ['Vendor rating', '★ 4.8 · 63 trips']].map(([l, v]) => (
        <div key={l} className="flex justify-between mb-2">
          <span className="font-sans text-[0.62rem] tracking-[0.06em]" style={{ color: 'var(--cream-dim)' }}>{l}</span>
          <span className="font-sans text-[0.72rem] font-semibold" style={{ color: l === 'Vendor rating' ? 'var(--amber)' : 'var(--cream)' }}>{v}</span>
        </div>
      ))}
      <div className="h-px my-3" style={{ background: 'var(--gold-line)' }} />
      <div className="flex justify-between items-center">
        <span className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--cream)' }}>Total</span>
        <span className="font-serif text-[1.4rem] font-medium" style={{ color: 'var(--amber)' }}>100,000 XAF</span>
      </div>
    </div>
  ),
  // Step 2 — vendor card
  (
    <div key="s2" className="rounded-xl p-5 w-full" style={{ background: 'rgba(13,9,5,0.85)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-warm-border)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full flex items-center justify-center font-serif text-base font-medium shrink-0" style={{ background: 'var(--leather)', border: '2px solid var(--amber)', color: 'var(--amber)' }}>JN</div>
        <div>
          <div className="font-serif text-[0.95rem] font-medium" style={{ color: 'var(--cream)' }}>Jean-Pierre N.</div>
          <div className="font-sans text-[0.6rem] mt-0.5" style={{ color: 'var(--cream-dim)' }}>Verified vendor · Douala</div>
        </div>
      </div>
      {[['✓', 'RCCM certificate verified'], ['✓', 'Carte grise on file'], ['✓', 'CIMA insurance valid'], ['✓', 'Visite technique passed']].map(([icon, text]) => (
        <div key={text} className="flex items-center gap-2 py-1 font-sans text-[0.68rem]" style={{ color: 'var(--cream-dim)' }}>
          <span style={{ color: 'var(--amber)', fontWeight: 700 }}>{icon}</span> {text}
        </div>
      ))}
    </div>
  ),
  // Step 3 — payment card
  (
    <div key="s3" className="rounded-xl p-5 w-full" style={{ background: 'rgba(13,9,5,0.85)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-warm-border)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-serif text-base font-medium" style={{ color: 'var(--cream)' }}>Booking #KR-2847</span>
        <span className="font-sans text-[0.6rem] font-bold tracking-[0.12em] uppercase px-[10px] py-1 rounded-full" style={{ background: 'rgba(200,132,26,0.15)', color: 'var(--amber)' }}>Awaiting Payment</span>
      </div>
      {[['Rental (4 days)', '100,000 XAF'], ['Karu service fee', '10,000 XAF']].map(([l, v]) => (
        <div key={l} className="flex justify-between mb-2">
          <span className="font-sans text-[0.62rem]" style={{ color: 'var(--cream-dim)' }}>{l}</span>
          <span className="font-sans text-[0.72rem] font-semibold" style={{ color: 'var(--cream)' }}>{v}</span>
        </div>
      ))}
      <div className="h-px my-3" style={{ background: 'var(--gold-line)' }} />
      <div className="flex justify-between items-center mb-3">
        <span className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--cream)' }}>Total</span>
        <span className="font-serif text-[1.4rem] font-medium" style={{ color: 'var(--amber)' }}>110,000 XAF</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 py-2 rounded-md text-center font-sans text-[0.6rem] font-bold tracking-[0.06em]" style={{ background: 'rgba(255,204,0,0.08)', border: '1px solid var(--gold-line)', color: '#FFCC00' }}>MTN MoMo</div>
        <div className="flex-1 py-2 rounded-md text-center font-sans text-[0.6rem] font-bold tracking-[0.06em]" style={{ background: 'rgba(255,102,0,0.08)', border: '1px solid var(--gold-line)', color: '#FF6600' }}>Orange Money</div>
      </div>
    </div>
  ),
  // Step 4 — notification card
  (
    <div key="s4" className="rounded-[14px] p-4 w-full flex items-start gap-3" style={{ background: 'rgba(13,9,5,0.9)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-warm-border)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
      <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg shrink-0" style={{ background: 'var(--amber)' }}>🚗</div>
      <div>
        <div className="font-sans text-[0.78rem] font-semibold mb-1" style={{ color: 'var(--cream)' }}>Booking Confirmed</div>
        <div className="font-sans text-[0.68rem] leading-[1.5]" style={{ color: 'var(--cream-dim)' }}>Toyota Camry · Jean-Pierre N. · Ready at Douala Airport, Terminal 1.</div>
        <div className="font-sans text-[0.58rem] mt-1.5 tracking-[0.06em]" style={{ color: 'var(--amber)' }}>Just now · Karu</div>
      </div>
    </div>
  ),
]

export function HowSection() {
  const t = useTranslations('how')

  const steps = [
    { num: t('s1_num'), title: t('s1_title'), em: t('s1_title_em'), desc: t('s1_desc'), flip: false, bg: 'var(--mesh-amber)', border: 'rgba(200,132,26,0.2)' },
    { num: t('s2_num'), title: t('s2_title'), em: t('s2_title_em'), desc: t('s2_desc'), flip: true,  bg: 'var(--mesh-deep)', border: 'var(--gold-line)' },
    { num: t('s3_num'), title: t('s3_title'), em: t('s3_title_em'), desc: t('s3_desc'), flip: false, bg: 'var(--mesh-gold)', border: 'rgba(200,132,26,0.25)' },
    { num: t('s4_num'), title: t('s4_title'), em: t('s4_title_em'), desc: t('s4_desc'), flip: true,  bg: 'var(--mesh-amber)', border: 'rgba(200,132,26,0.2)' },
  ]

  return (
    <section id="how" style={{ background: 'var(--deep)', borderTop: '1px solid var(--gold-line)' }}>
      <div className="max-w-[1240px] mx-auto px-5 md:px-16">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`reveal grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center py-16 md:py-24 ${i < steps.length - 1 ? 'border-b' : ''}`}
            style={{ borderColor: 'var(--gold-line)', direction: step.flip ? 'rtl' : 'ltr' }}
          >
            <div style={{ direction: 'ltr' }}>
              <div className="flex items-center gap-3 font-sans text-[0.72rem] font-medium tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--amber)' }}>
                <span className="block w-8 h-px" style={{ background: 'var(--amber)' }} />
                {step.num}
              </div>
              <h2 className="font-serif font-light leading-[1] mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3.8rem)', color: 'var(--cream)' }}>
                {step.title.replace(step.em, '').trim()}{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--amber-light)' }}>{step.em}</em>
              </h2>
              <p className="font-serif font-light leading-[1.85] max-w-[440px]" style={{ fontSize: '1rem', color: 'var(--cream-dim)' }}>
                {step.desc}
              </p>
            </div>
            <div
              className="rounded-[20px] p-6 md:p-9 flex items-end min-h-[280px] md:min-h-[320px] relative overflow-hidden"
              style={{
                background: step.bg,
                border: `1px solid ${step.border}`,
                boxShadow: 'var(--shadow-float)',
                direction: 'ltr',
              }}
            >
              <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-[280px] h-[180px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(200,132,26,0.15) 0%, transparent 70%)' }} />
              <div className="w-full">{STEP_CARDS[i]}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
