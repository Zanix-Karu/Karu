---
tags: [karu, design, components]
created: 2026-05-10
---

# Component Library

## UI Primitives (`components/ui/`)

### Button
3 variants: `primary`, `ghost`, `nav`.

```tsx
<Button variant="primary">Pre-Register</Button>
```

- Primary: amber fill, espresso text, shimmer sweep on hover, lift -3px
- Ghost: transparent, cream border, amber on hover
- Nav: smaller padding for navigation

### Input
Labelled text input with error state.

- Amber left-border slides in on focus
- Red border + ring on error
- `aria-invalid` and `aria-describedby` for screen readers

### AnimatedCounter
IntersectionObserver-triggered count animation.

```tsx
<AnimatedCounter target={500} suffix="+" duration={1800} />
```

- Uses `easeOutQuart` for smooth deceleration
- Respects `prefers-reduced-motion`

### ScrollReveal
Wrapper for scroll-triggered fade animations.

```tsx
<ScrollReveal direction="left" delay={0.1}>
  <YourContent />
</ScrollReveal>
```

Variants: `up`, `left`, `right`. Always `viewport: { once: true }`.

### CustomCursor
Two-layer custom cursor (dot + trailing circle). Desktop only.

### BackToTop
Floating amber button that appears after scrolling past hero.

### Ticker
Infinite scroll ticker for the amber band.

### Icon
SVG icons using `currentColor`. 12 brand icons available:
- IconShield, IconCreditCard, IconPlane, IconStar, IconCar
- IconChat, IconMapPin, IconTarget, IconUsers, IconCheckCircle
- IconQuote, IconWhatsApp

## Landing Components (`components/landing/`)

### HeroSection
RSC shell with background. Renders:
- Radial gradient background
- SVG dot-grid overlay (parallax target)
- 4 diagonal amber streaks (animated, opacity 0 base)
- Floating SVG car silhouette
- AnimatedHeroContent (client) for the actual UI

### AnimatedHeroContent (client)
Pill badge → headline → eyebrow → description → CTAs → social proof counter.

Stagger: 120ms between items, 100ms initial delay.

### TickerBand
Amber band with 8 scrolling brand phrases.

### AboutSection
2-column layout:
- Left: section tag + heading + 2 paragraphs + CTA
- Right: 2×2 card grid + full-width quote card

### HowItWorksSection
4 steps with diamond numbered icons.

- Connecting line behind diamonds (`amber/20`)
- Diamond rotates from 45° to 90° on hover
- Title turns amber on hover

### FeaturesGrid
3×2 grid of FeatureCards.

### FeatureCard
- bg-card-bg, border-card-border
- Top amber bar slides in on hover (scaleX 0→1)
- Hover gradient shift (subtle amber)
- Ghost number 01-06 in bottom right (scales up on hover)

### CitiesSection
2 city cards (Douala + Yaoundé).

### CityCard
- Hover lift -8px
- Amber radial glow appears bottom right
- Ghost city code (DLA, YAO) at right
- Pulsing amber dot in badge
- Coordinates fade in on hover

### WaitlistSection
Multi-step form (type → details). See [[13 - API Routes#POST /api/waitlist]].

### FooterSection
Logo, tagline, nav links, copyright.

## Section Pattern

Every section opens with this header:

```tsx
<div className="flex flex-col items-center gap-5 mb-16 text-center">
  <div className="inline-flex items-center gap-[10px] text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-amber">
    <span className="block w-7 h-px bg-amber" />
    SECTION TAG
    <span className="block w-7 h-px bg-amber" />
  </div>
  <h2 className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] leading-[1.1] text-cream">
    Heading with <em className="italic">italic emphasis</em>
  </h2>
</div>
```

## Animations

### Library (`lib/animations.ts`)
- `fadeUp`, `fadeLeft`, `fadeRight`, `fadeScale`
- `staggerContainer`, `staggerFast`
- `cardHover`, `scaleOnTap`, `glowPulse`

### Constants
```ts
viewportOnce = { once: true, margin: '-80px' }
revealTransition = { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
springTransition = { type: 'spring', stiffness: 300, damping: 20 }
```

### CSS Keyframes (`app/globals.css`)
- `ticker` — 22s linear infinite
- `streak1-4` — diagonal sweeps with rotates
- `carFloat` — gentle vertical bob
- `badgePulse` — scale + opacity pulse
- `ctaPulse` — box-shadow ripple
- `formGlow` — breathing shadow

See [[20 - Design System]]
