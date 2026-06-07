---
tags: [karu, design, foundation]
created: 2026-05-10
---

# Design System

> Two systems fused: Cluely's product-forward structure + Karu's warm dark palette.

## Aesthetic

**Luxury-functional.** Premium without being cold. African warmth encoded in grain, gradients, and amber accents.

The page stays dark throughout. One unforgettable element: a subtle floating SVG car silhouette in the hero with diagonal amber light streaks.

## Colour Palette

### Backgrounds (always dark)
```css
--color-espresso:    #1C1208    /* main page bg */
--color-brown-dark:  #2A1A0A    /* alt section bg */
--color-brown-mid:   #3D2510    /* waitlist bg */
--color-brown-warm:  #5C3A1E    /* subtle accents */
--color-surface:     #231508    /* "How It Works" bg */
--color-card-bg:     #2E1C0D    /* cards */
--color-card-border: rgba(255, 195, 90, 0.10)
```

### Accent (amber — only)
```css
--color-amber:       #E8A020    /* primary CTA, headlines */
--color-amber-light: #F5BF45    /* hover */
--color-amber-pale:  rgba(232, 160, 32, 0.12)
--color-amber-glow:  rgba(232, 160, 32, 0.30)
```

### Text (cream — never pure white)
```css
--color-cream:       #F5EFE4    /* primary */
--color-cream-dim:   rgba(245, 239, 228, 0.50)
--color-cream-faint: rgba(245, 239, 228, 0.20)
--color-cream-ghost: rgba(245, 239, 228, 0.07)
```

### Rules
- Page bg **always** `--color-espresso`
- Sections alternate between espresso, brown-dark, surface, brown-mid
- Primary CTA **always** amber fill with espresso text
- **NEVER** use purple, blue, red, green as accents
- **NEVER** use rounded corners > 20px on major cards
- **NEVER** use pure white (#FFFFFF) on dark — use cream

## Typography

### Fonts
- **DM Serif Display** — section headings, italic emphasis (`--font-dm-serif`)
- **Playfair Display** — hero, stat numbers, city names (`--font-playfair`, weight 900)
- **DM Sans** — all body, UI, labels (`--font-dm-sans`)

All loaded via `next/font/google` with `display: swap`.

### Type Scale

| Role | Font | Weight | Size |
|------|------|--------|------|
| Hero headline | Playfair Display | 900 | `clamp(3.4rem, 9vw, 8.5rem)` |
| Section heading | DM Serif Display | 400 | `clamp(2.5rem, 5.5vw, 5rem)` |
| Section heading italic | DM Serif | 400 italic | — |
| Stat number | Playfair Display | 900 | 3.2rem |
| City name | Playfair Display | 900 | 4rem |
| Eyebrow / pill | DM Sans | 600 | 0.72rem, ls 0.18em, uppercase, amber |
| Section tag | DM Sans | 600 | 0.7rem, ls 0.2em, uppercase |
| Body | DM Sans | 300 | 1rem, leading 1.8, cream/70 |
| Nav links | DM Sans | 500 | 0.78rem, ls 0.1em, uppercase |
| Micro labels | DM Sans | 500-600 | 0.64-0.72rem, uppercase |
| Button text | DM Sans | 600 | 0.85rem, ls 0.07em, uppercase |

### Rules
- **Always** use `clamp()` for hero and section headings
- **Never** use Inter, Roboto, Arial, system-ui for display
- **Never** use `px` for font sizes — use `rem` or `clamp`
- Hero italic emphasis on second line ("Rental Cars" in italic amber)
- UPPERCASE labels have 0.18-0.22em letter-spacing

## Motion System

See [[21 - Component Library#Animations]] for full details.

### Standards
```ts
viewportOnce = { once: true, margin: '-80px' }
revealTransition = { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
```

### Performance Rules
- **Only** animate `transform` and `opacity` (GPU)
- **Never** animate `width`, `height`, `top`, `left`
- Respect `prefers-reduced-motion: reduce`
- Hero streaks hidden on mobile
- Custom cursor disabled on touch devices

## Custom Cursor (desktop only)

Two layers:
- **Dot** (8px amber, instant) — follows mouse exactly
- **Circle** (36px amber border, lerp 0.14) — trails

On hover over interactive elements: circle expands to 64px.

## Mobile

- Custom cursor: hidden
- Hero streaks: hidden
- Sections: natural height
- Touch targets: min 44px
- Animations: simplified
- Buttons: full width on mobile

See [[42 - Known Constraints#Mobile]]

## Accessibility

- All interactive elements: `focus-visible` amber ring + 2px offset
- All animations respect `prefers-reduced-motion`
- All inputs have `<label>` (not just placeholders)
- Logical heading hierarchy (1× h1, h2 for sections)
- WCAG AA contrast minimum

## Reusable Patterns

See [[22 - Layout Patterns]]
