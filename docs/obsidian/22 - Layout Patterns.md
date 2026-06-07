---
tags: [karu, design, patterns]
created: 2026-05-10
---

# Layout Patterns

## Section Order (landing page)

1. **Navigation** — sticky, transparent → blurred dark on scroll
2. **Hero** — full viewport, centred, animated
3. **Ticker Band** — amber with scrolling phrases
4. **About** — 2 col with cards
5. **How It Works** — 4 step diamonds
6. **Features Grid** — 3×2 cards
7. **Cities** — 2 col Douala + Yaoundé
8. **Waitlist** — multi-step form
9. **Footer** — logo, links, copyright

## Spacing

- Section padding: `py-16 sm:py-20` (mobile) → `py-24` (desktop large)
- Inner max-width: `max-w-7xl` (1280px) for most sections, `max-w-3xl` for content-heavy pages
- Inner horizontal padding: `px-4 sm:px-6`

## Grid Patterns

### 2-column with offset
Used in About section.
```
[Section tag]                 |  [Card 1] [Card 2]
[Heading large]               |  [Card 3] [Card 4]
[Paragraph 1]                 |  [Quote card full]
[Paragraph 2]                 |
[CTA button]                  |
```

### 3×2 features grid
```
[Card] [Card] [Card]
[Card] [Card] [Card]
```

### 4 step row
```
[01]──[02]──[03]──[04]
```
With horizontal `amber/20` line behind diamonds (desktop only).

### 2 city cards
```
[ Douala (DLA) ] [ Yaoundé (NSI) ]
```

## Reusable JSX Snippets

### Section opener
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

### Ghost number decoration
```tsx
<span
  className="absolute bottom-0 right-2 font-serif2 text-[8rem] font-black opacity-[0.05] text-cream pointer-events-none leading-none select-none"
  aria-hidden="true"
>
  01
</span>
```

### Card with hover lift
```tsx
<motion.div
  className="group relative bg-card-bg border border-card-border p-6 md:p-10"
  whileHover={{ y: -4 }}
  transition={{ duration: 0.35, ease: 'easeOut' }}
>
```

### Animated section
```tsx
<ScrollReveal direction="up" delay={i * 0.1}>
  <YourContent />
</ScrollReveal>
```

### Pill badge
```tsx
<div className="inline-flex items-center gap-2 bg-amber/10 border border-amber/[0.22] px-[18px] py-[7px] rounded-full">
  <span className="w-1.5 h-1.5 bg-amber rounded-full animate-pulse" />
  <span className="text-[0.72rem] font-medium tracking-[0.18em] uppercase text-amber">
    Launching Soon
  </span>
</div>
```

## Mobile Behaviour

- Sections: natural height (not `min-h-screen`)
- Cards: stack vertically (`grid-cols-1`)
- Buttons: `w-full sm:w-auto` (full width on mobile)
- Custom cursor: hidden
- Hero streaks: hidden
- Touch targets: enforced 44px minimum

See [[20 - Design System#Mobile]]

## Don'ts

- Don't add images to landing page (kept image-free for performance)
- Don't use rounded corners > 20px on major cards
- Don't use any colour outside the palette
- Don't animate layout properties (only transform/opacity)
- Don't use em dashes in JSON copy (use commas/full stops)
- Don't use Inter, Roboto, Arial for display text
- Don't use `useEffect` for data fetching (use SWR or RSC)
