import { AnimatedHeroContent } from './AnimatedHeroContent'

/** RSC shell — static background layers + client animated content */
export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-espresso"
    >
      {/* ── Radial gradient: brown-mid centre → espresso edges ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 40%, #3D2510 0%, #2A1A0A 45%, #1C1208 100%)',
        }}
      />

      {/* ── Grain texture overlay ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grain-overlay"
      />

      {/* ── SVG dot-grid overlay (parallax target — id used by client) ── */}
      <svg
        id="hero-grid"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{ opacity: 0.18 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dot-grid"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="#E8A020" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>

      {/* ── Diagonal amber streaks — opacity: 0 base prevents flash ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* streak 1 */}
        <div
          className="hero-streak opacity-0 absolute top-[20%] left-0 w-[200%] h-[2px] bg-gradient-to-r from-transparent via-amber to-transparent"
          style={{ animation: 'streak1 7s ease-in-out 0.5s infinite' }}
        />
        {/* streak 2 */}
        <div
          className="hero-streak opacity-0 absolute top-[45%] left-0 w-[200%] h-[1.5px] bg-gradient-to-r from-transparent via-amber to-transparent"
          style={{ animation: 'streak2 9s ease-in-out 2s infinite' }}
        />
        {/* streak 3 */}
        <div
          className="hero-streak opacity-0 absolute top-[65%] left-0 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-amber-light to-transparent"
          style={{ animation: 'streak3 11s ease-in-out 4s infinite' }}
        />
        {/* streak 4 */}
        <div
          className="hero-streak opacity-0 absolute top-[30%] left-0 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-amber to-transparent"
          style={{ animation: 'streak4 13s ease-in-out 1s infinite' }}
        />
      </div>

      {/* ── Floating SVG car silhouette — hidden on mobile ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] bottom-[14%] opacity-[0.07] hidden md:block"
        style={{ animation: 'carFloat 6s ease-in-out infinite' }}
      >
        <svg
          width="340"
          height="140"
          viewBox="0 0 340 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body */}
          <path
            d="M30 90 L50 50 Q60 30 80 28 L200 24 Q230 24 250 40 L310 70 Q330 76 330 90 L330 105 Q330 112 322 112 L290 112 Q285 130 268 130 Q251 130 246 112 L94 112 Q89 130 72 130 Q55 130 50 112 L18 112 Q10 112 10 105 L10 90 Z"
            fill="#E8A020"
          />
          {/* Windshield */}
          <path
            d="M90 30 L80 70 L200 70 L210 30 Z"
            fill="#1C1208"
            opacity="0.6"
          />
          {/* Rear window */}
          <path
            d="M215 30 L205 70 L255 70 L260 50 Q255 32 240 30 Z"
            fill="#1C1208"
            opacity="0.6"
          />
          {/* Front wheel */}
          <circle cx="268" cy="112" r="22" fill="#2A1A0A" />
          <circle cx="268" cy="112" r="10" fill="#E8A020" opacity="0.4" />
          {/* Rear wheel */}
          <circle cx="72" cy="112" r="22" fill="#2A1A0A" />
          <circle cx="72" cy="112" r="10" fill="#E8A020" opacity="0.4" />
        </svg>
      </div>

      {/* ── Client animated content (pill, headline, CTAs) ── */}
      <AnimatedHeroContent />

      {/* ── Scroll hint — smoother custom animation ── */}
      <div
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 scroll-hint"
      >
        <span className="text-[0.6rem] font-medium tracking-[0.2em] uppercase text-cream/40">
          Scroll
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="#F5EFE4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
          />
        </svg>
      </div>
    </section>
  )
}
