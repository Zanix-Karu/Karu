---
inclusion: fileMatch
fileMatchPattern: ["components/landing/**/*", "components/ui/**/*", "app/**/page.tsx"]
---

# Zanix — Landing Page Design System

> This file is auto-included when working on any landing page component or UI primitive.

## Visual Design System

### Colour Tokens

```css
:root {
  /* Backgrounds */
  --color-espresso:    #1C1208;
  --color-brown-dark:  #2A1A0A;
  --color-brown-mid:   #3D2510;
  --color-brown-warm:  #5C3A1E;
  --color-surface:     #231508;
  --color-card-bg:     #2E1C0D;
  --color-card-border: rgba(255, 195, 90, 0.10);

  /* Accent */
  --color-amber:       #E8A020;
  --color-amber-light: #F5BF45;
  --color-amber-pale:  rgba(232, 160, 32, 0.12);
  --color-amber-glow:  rgba(232, 160, 32, 0.30);

  /* Text */
  --color-cream:       #F5EFE4;
  --color-cream-dim:   rgba(245, 239, 228, 0.50);
  --color-cream-faint: rgba(245, 239, 228, 0.20);
  --color-cream-ghost: rgba(245, 239, 228, 0.07);
  --color-white:       #FEFCF8;

  /* Typography */
  --font-serif:  var(--font-dm-serif), Georgia, serif;
  --font-serif2: var(--font-playfair), Georgia, serif;
  --font-sans:   var(--font-dm-sans), sans-serif;
}
```

### Typography Scale

| Role | Font | Weight | Size |
|---|---|---|---|
| Hero title | Playfair Display | 900 | `clamp(3.4rem, 9vw, 8.5rem)` |
| Section heading | DM Serif Display | 400 | `clamp(2.5rem, 5.5vw, 5rem)` |
| Section heading italic | DM Serif Display | 400 italic | — |
| Stat number | Playfair Display | 900 | `3.2rem` |
| City name | Playfair Display | 900 | `4rem` |
| Eyebrow/pill text | DM Sans | 600 | `0.72rem`, `letter-spacing: 0.18em` |
| Body | DM Sans | 300 | `1rem`, `line-height: 1.8` |
| Nav links | DM Sans | 500 | `0.78rem`, `letter-spacing: 0.1em` |
| Micro labels | DM Sans | 500–600 | `0.64–0.72rem` |

**Always** use `clamp()` for hero and section headings to ensure fluid scaling. **Never** use `px` for font sizes — use `rem` or `clamp`.

---

## Component Specifications

### Button Variants

**Primary (`btn-main`)**
```tsx
// Amber fill, espresso text, shimmer on hover
<button className="
  bg-amber text-espresso
  px-10 py-[15px]
  text-[0.85rem] font-semibold tracking-[0.07em] uppercase
  relative overflow-hidden
  transition-transform duration-250
  hover:-translate-y-[3px] hover:shadow-[0_18px_55px_rgba(232,160,32,0.4)]
  focus-visible:ring-2 focus-visible:ring-amber focus-visible:outline-none
">
  {/* Shimmer pseudo-element via CSS */}
  Pre-Register Now
</button>
```

**Ghost (`btn-ghost`)**
```tsx
// Transparent, cream border, amber on hover
<button className="
  bg-transparent text-cream
  border border-cream/20 px-10 py-[15px]
  text-[0.85rem] font-medium tracking-[0.07em] uppercase
  transition-all duration-250
  hover:border-amber hover:text-amber hover:-translate-y-[3px]
  focus-visible:ring-2 focus-visible:ring-amber focus-visible:outline-none
">
  List Your Car →
</button>
```

**Nav CTA**
```tsx
// Same as primary but smaller padding
<button className="bg-amber text-espresso border-none py-[11px] px-7 ...">
  Pre-Register
</button>
```

### Animated Pill Badge

```tsx
<div className="inline-flex items-center gap-2 bg-amber/10 border border-amber/22 px-[18px] py-[7px]">
  <span className="w-1.5 h-1.5 bg-amber rounded-full animate-pulse" />
  <span className="text-[0.72rem] font-medium tracking-[0.18em] uppercase text-amber">
    Douala & Yaoundé · Launching Soon
  </span>
</div>
```

### Section Tag

Every section opens with this tag pattern:
```tsx
<div className="inline-flex items-center gap-[10px] text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-amber">
  <span className="block w-7 h-px bg-amber" />
  About Zanix
</div>
```

### Card Components

**Feature Card (`fcard`)**
- Background: `var(--color-card-bg)`
- Border: `1px solid var(--color-card-border)`
- Hover: Top amber gradient bar animates in (`scaleX: 0 → 1, origin: left`)
- Padding: `52px 40px`
- Large ghost number (01–06) positioned bottom-right: `opacity: 0.05`

**City Card**
- Oversized ghost city code (DLA, YAO) positioned right: `opacity: 0.025`
- City name: Playfair Display 900, `4rem`
- GPS coordinates bottom-right: `0.64rem`, very low opacity
- Hover: amber glow radial gradient appears (bottom-right), card lifts `-8px`

### Stats Row

Four equally-divided cells, border-separated. Each stat:
- Large Playfair Display number with suffix (e.g., `500+`, `24/7`)
- Animates from `0` to final value on first scroll into view (1.8s ease-out, quartic easing)
- Amber underline animates from 0 to 40px width on scroll-in

---

## Animation Library (`lib/animations.ts`)

All Framer Motion variants are defined here and imported — never defined inline in components.

```ts
export const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0 },
}

export const fadeLeft = {
  hidden: { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0 },
}

export const fadeRight = {
  hidden: { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0 },
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

export const cardHover = {
  rest: { y: 0 },
  hover: { y: -8, transition: { duration: 0.35, ease: 'easeOut' } },
}
```

**Scroll trigger pattern** (always use `once: true`):
```tsx
<motion.div
  variants={fadeUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-80px' }}
  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
>
```

---

## Landing Page Section Order

1. **Navigation** — fixed, transparent → blurred dark on scroll (stuck at 80px)
2. **Hero** — full viewport, centred, animated title + pill + CTAs + scroll hint
3. **Ticker** — amber background, infinite scroll ticker with key brand phrases
4. **Stats Row** — 4 animated counters on dark background
5. **About Section** — 2-col grid: copy left, feature cards right
6. **How It Works** — 4 steps with decorative connecting line, numbered diamond icons
7. **Features Grid** — 3×2 grid of feature cards
8. **Cities Section** — 2-col city cards (Douala, Yaoundé)
9. **Waitlist CTA** — full-width section, large headline, email form
10. **Footer** — logo, links, copyright

---

## Waitlist Form — Interactive Spec

The waitlist form is the primary conversion goal of the landing page.

### Fields
1. **Email** — text input, full-width on mobile, fills space left of button on desktop
2. **Type toggle** — Customer / Vendor (segmented control, below email on mobile)
3. **City select** — Douala / Yaoundé / Other (optional, shown after type selection)

### States
- **Idle**: Input with amber focus ring, amber "Join Waitlist" button
- **Loading**: Button shows spinner, input disabled
- **Success**: Form replaced with amber checkmark + personalised message ("You're in! We'll notify you when we launch in Douala.")
- **Error**: Red-tinted border on input, error message below, button re-enabled
- **Duplicate**: Same as success — do not reveal the email was already registered

### Micro-interactions
- Email input: amber left-border appears on focus
- Button: shimmer sweep on hover, press scale on click
- Success: fade-out form → fade-in success state (300ms)
- Counter below form: live count of signups (fetched from `/api/waitlist/count`, cached 60s)

---

## Accessibility Requirements

- All interactive elements must have `focus-visible` styles (amber ring, 2px offset)
- Custom cursor (`CustomCursor.tsx`) must be hidden when `prefers-reduced-motion: reduce`
- All animations respect `prefers-reduced-motion`: use `motion` component's `initial={shouldReduce ? false : 'hidden'}`
- Colour contrast: text on espresso background must pass WCAG AA (4.5:1 for body, 3:1 for large text)
  - `cream` on `espresso`: passes ✓
  - `amber` on `espresso`: passes ✓ (large text only — do not use amber for small body text)
- `<img>` elements (via `next/image`) must have descriptive `alt` text
- Navigation must be keyboard-navigable with visible focus states
- Form inputs must have associated `<label>` elements (not just placeholder text)
- Section headings (`h1`–`h6`) must follow logical hierarchy: one `h1` per page

---

## Performance Rules

- **Hero image**: none — use CSS gradients and SVG car illustration (already implemented in existing HTML)
- **Car listing images**: WebP only, served via Supabase CDN, loaded with `next/image` and `priority={false}` unless above fold
- **Video**: Do not add autoplay video to the landing page — too heavy for mobile African networks
- **Animations**: GPU-accelerated only (`transform`, `opacity`). Use `will-change: transform` sparingly
- **Third-party scripts**: Plausible only — loaded with `strategy="lazyOnload"` via `next/script`
- **Font loading**: `display: swap` for all web fonts
