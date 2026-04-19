import { AnimatedHeroContent } from './AnimatedHeroContent'

export function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center text-center px-5 md:px-8 pt-36 pb-16"
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 55% at 50% 100%, rgba(46,24,8,0.6) 0%, transparent 65%),
            radial-gradient(ellipse 55% 35% at 30% 20%, rgba(26,14,7,0.8) 0%, transparent 60%),
            linear-gradient(168deg, #0D0905 0%, #120C06 45%, #1A0E07 75%, #0D0905 100%)
          `,
        }}
        aria-hidden="true"
      />
      {/* Diagonal accent lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(-62deg, transparent, transparent 220px, rgba(200,132,26,0.025) 220px, rgba(200,132,26,0.025) 221px)',
        }}
        aria-hidden="true"
      />

      <AnimatedHeroContent />

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce" aria-hidden="true">
        <span className="font-sans text-[0.6rem] font-medium tracking-[0.2em] uppercase" style={{ color: 'var(--cream-dim)' }}>Scroll</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cream-dim)' }} />
        </svg>
      </div>
    </section>
  )
}
