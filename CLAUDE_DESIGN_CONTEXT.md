# Karu — Design Context

## Brand Identity

**Product**: Karu — verified car rental marketplace for Cameroon
**Domain**: getkaru.io
**Parent**: Zanix
**Cities**: Douala (DLA), Yaoundé (NSI)
**Tone**: Confident, warm, local-first. British English. Bilingual EN/FR.

**Voice principles**:
- Confident, not arrogant
- Warm, not chatty
- Plain language, never SaaS-speak
- "No stress, no hidden arrangements, no surprises"
- Local references natural (MTN MoMo, FCFA, Douala Airport, RCCM)

---

## Design Aesthetic

**Style**: Luxury-functional. Premium without being cold. African warmth encoded in grain, gradients, and amber accents.

**Mood**: Dark espresso backgrounds with burnished amber gold. Dim cream text. Subtle motion. Custom serif typography. Premium feel like a high-end editorial site.

**References**: Cluely's product-forward structure + Karu's own warm dark palette. Elegant, not generic.

---

## Colour Palette

### Backgrounds (always dark)
```
--color-espresso:    #1C1208    -- main page background
--color-brown-dark:  #2A1A0A    -- section backgrounds (alt 1)
--color-brown-mid:   #3D2510    -- waitlist section (alt 2)
--color-brown-warm:  #5C3A1E    -- subtle accents
--color-surface:     #231508    -- "How It Works" section
--color-card-bg:     #2E1C0D    -- card backgrounds
--color-card-border: rgba(255, 195, 90, 0.10)
```

### Accent (amber — the only accent colour)
```
--color-amber:       #E8A020    -- primary CTA, headlines, accents
--color-amber-light: #F5BF45    -- hover states
--color-amber-pale:  rgba(232, 160, 32, 0.12)    -- subtle backgrounds
--color-amber-glow:  rgba(232, 160, 32, 0.30)    -- shadows, glows
```

### Text (cream — never pure white)
```
--color-cream:       #F5EFE4    -- primary text
--color-cream-dim:   rgba(245, 239, 228, 0.50)   -- secondary text
--color-cream-faint: rgba(245, 239, 228, 0.20)   -- tertiary text
--color-cream-ghost: rgba(245, 239, 228, 0.07)   -- hint text
--color-white:       #FEFCF8    -- pure white (used sparingly)
```

### Rules
- Page bg is **always** `--color-espresso`
- Sections alternate between `espresso`, `brown-dark`, `surface`, `brown-mid`
- Primary CTA is **always** amber fill with espresso text
- **NEVER** use purple, blue, red, or green as accents
- **NEVER** use rounded corners > 20px on major cards (mostly square edges)
- **NEVER** use pure white (#FFFFFF) on dark backgrounds — use cream

---

## Typography

### Fonts (loaded via next/font/google with display: swap)
- **DM Serif Display** (`--font-dm-serif`) — section headings, italic emphasis
- **Playfair Display** (`--font-playfair`) — hero headline, stat numbers, city names (heavy, 900)
- **DM Sans** (`--font-dm-sans`) — all body, UI text, labels

### Type Scale

| Role | Font | Weight | Size | Notes |
|------|------|--------|------|-------|
| Hero headline | Playfair Display | 900 | `clamp(3.4rem, 9vw, 8.5rem)` | tight tracking, leading 0.95 |
| Section heading | DM Serif Display | 400 | `clamp(2.5rem, 5.5vw, 5rem)` | leading 1.1 |
| Section heading italic | DM Serif Display | 400 italic | — | for emphasised words |
| Stat number | Playfair Display | 900 | 3.2rem | tabular-nums |
| City name | Playfair Display | 900 | 4rem | leading none |
| Eyebrow / pill text | DM Sans | 600 | 0.72rem | letter-spacing 0.18em, uppercase, amber |
| Section tag | DM Sans | 600 | 0.7rem | letter-spacing 0.2em, with amber underline `─` |
| Body | DM Sans | 300 | 1rem | leading 1.8, cream/70 |
| Nav links | DM Sans | 500 | 0.78rem | letter-spacing 0.1em, uppercase |
| Micro labels | DM Sans | 500-600 | 0.64-0.72rem | uppercase |
| Button text | DM Sans | 600 | 0.85rem | letter-spacing 0.07em, uppercase |

### Rules
- **Always** use `clamp()` for hero and section headings (fluid scaling)
- **Never** use Inter, Roboto, Arial, or system-ui for display text
- **Never** use `px` for font sizes — use `rem` or `clamp`
- Hero italic emphasis on the second line (e.g., "Rental Cars" in italic amber)
- All UPPERCASE labels have generous letter-spacing (0.18-0.22em)

---

## Layout Structure

Every section follows this pattern:

```
[Optional section tag with amber dash line]  ABOUT KARU
[Heading — DM Serif Display, optional italic emphasis]
  Built for Cameroon,
  from day one
[Body / cards / interactive content]
```

**Page section order**:
1. Navigation (sticky, transparent → blurred dark on scroll)
2. Hero — full viewport, centred
3. Ticker — amber band with scrolling phrases
4. About — 2 col: copy left, 2×2 card grid + quote card right
5. How It Works — 4 steps with diamond numbered icons + connecting line
6. Features — 3×2 grid of cards with hover effects
7. Cities — 2 col: Douala + Yaoundé cards
8. Waitlist — multi-step form
9. Footer — logo, links, copyright

**Min-heights**: Hero, Cities, How It Works, Waitlist all `min-h-screen` on desktop. Mobile uses natural content height.

**Max-widths**: Most sections use `max-w-7xl` (1280px) with `px-4 sm:px-6` padding.

---

## Component Specs

### Buttons

**Primary (`btn-main`)**
```
- Amber fill (#E8A020), espresso text (#1C1208)
- Padding: px-10 py-[15px]
- Font: DM Sans 600, 0.85rem, letter-spacing 0.07em, uppercase
- Hover: -translate-y-[3px], shadow 0 18px 55px rgba(232,160,32,0.4)
- Shimmer pseudo-element sweep on hover (white/20)
- Active: scale-[0.98]
- Focus-visible: 2px amber ring, 2px offset
```

**Ghost (`btn-ghost`)**
```
- Transparent bg, cream text, cream/20 border
- Same padding/font as primary
- Hover: amber border, amber text, -translate-y-[3px]
- Active: scale-[0.98]
```

**Nav CTA**
```
- Same as primary but smaller: px-7 py-[11px]
- Has subtle amber pulse animation (`nav-cta-pulse`) to draw attention
```

### Pill Badge (used in hero)
```
Inline-flex, gap-2, rounded-full
bg-amber/10, border border-amber/[0.22], px-[18px] py-[7px]
- 1.5px amber pulsing dot
- Text: DM Sans 500, 0.72rem, letter-spacing 0.18em, uppercase, amber
```

### Section Tag (used at top of every section)
```
inline-flex items-center gap-[10px]
- 28px amber horizontal line ─
- Text: DM Sans 600, 0.7rem, letter-spacing 0.2em, uppercase, amber
- (Some sections have line on both sides for centred tags)
```

### Cards

**Feature Card**
- bg-card-bg, border-card-border
- px-6 py-10 (mobile), md:px-10 md:py-[52px]
- Top amber bar (3px) animates in from left on hover (scaleX 0→1)
- Hover gradient shift overlay (subtle 135deg amber)
- Ghost number 01-06 in bottom right (Playfair 900, 8rem, opacity 0.05)
- Hover: y -4px, ghost number scales up 110%
- Icon: 11×11 amber/10 bg, 22px icon

**City Card**
- Same bg/border as feature card
- p-6 md:p-10, min-h-[280px]
- Ghost city code (DLA, YAO) absolutely positioned right, opacity 0.025
- Hover: y -8px, amber radial glow appears (bottom right)
- Coordinates animate in on hover (translate-y + opacity)
- Pulsing amber dot in badge

### Diamond Icon (How It Works)
```
52×52, border-2 border-amber, rotated 45deg
Number text inside, rotated -45deg to keep upright
Hover: rotate to 90deg + scale 1.1 + amber glow
```

### Inputs
```
bg-card-bg, border-card-border, px-4 py-3.5
- Focus: amber border + 3px amber/15 ring
- Error: red-500/70 border
- Label: 0.72rem, letter-spacing 0.15em, uppercase, cream/60
- Amber left-border slides in on focus (peer-focus:scale-y-100)
```

---

## Motion System

### Library (`lib/animations.ts`)
- `fadeUp`: opacity 0/y 36 → opacity 1/y 0
- `fadeLeft`: opacity 0/x -36 → opacity 1/x 0
- `fadeRight`: opacity 0/x 36 → opacity 1/x 0
- `fadeScale`: opacity 0/scale 0.92 → opacity 1/scale 1
- `staggerContainer`: 0.1s stagger, 0.1s delay
- `cardHover`: y 0 → y -8px

### Standards
- `viewportOnce: { once: true, margin: '-80px' }`
- `revealTransition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }` (custom cubic-bezier)
- All scroll reveals use `whileInView` with viewport once
- All hover lifts use 0.35s easeOut
- All page entrance uses staggered children

### Hero Specific
- Stagger config: 120ms between items, 100ms initial delay
- Items fade up from y 36 with cubic [0.16, 1, 0.3, 1] easing
- Mouse parallax on dot-grid (pointer:fine only, ±20px max, 0.4 damping)
- 4 diagonal amber streaks animate across hero (different speeds: 7s/9s/11s/13s)
- Floating SVG car silhouette (6s ease-in-out infinite, opacity 0.07)

### CSS Animations
- `ticker` — 22s linear infinite (amber band scrolls)
- `streak1-4` — diagonal sweeps with rotate -35/-28/-42/-20deg
- `carFloat` — gentle vertical float
- `badgePulse` — scale 1 → 1.8, opacity 1 → 0.4
- `ctaPulse` — box-shadow ripple effect on nav CTA
- `formGlow` — subtle box-shadow breathing on waitlist form

### Performance Rules
- **Only** animate `transform` and `opacity` (GPU-accelerated)
- **Never** animate `width`, `height`, `top`, `left`, layout properties
- All animations respect `prefers-reduced-motion: reduce`
- Hero streaks hidden on mobile (perf)
- Custom cursor disabled on touch devices

---

## Custom Cursor

Desktop only. Two layers:
- **Dot** (8px, amber, no transition delay) — follows mouse instantly
- **Circle** (36px, 1.5px amber border, lerp 0.14) — trailing
- On hover over interactive elements: circle expands to 64px, dot stays small
- `body { cursor: none; }` when active

---

## Imagery

**Currently**: ZERO images on the page. All visuals are:
- CSS gradients (radial/linear)
- Inline SVG (icons, illustrations, OG image generated dynamically)
- Floating car silhouette is an inline SVG with multiple paths

**If adding images later**:
- WebP only
- `next/image` with explicit width/height
- `priority={false}` unless above fold
- Served via Supabase CDN

---

## Mobile Behaviour

- Custom cursor: hidden
- Hero streaks: hidden
- Sections: natural height (not min-h-screen)
- Touch targets: min 44px height
- Hero parallax: disabled (only `pointer: fine`)
- Vertical stacking on cards
- CTA buttons: full width on mobile (`w-full sm:w-auto`)

---

## Accessibility

- All interactive elements have `focus-visible` amber ring + 2px offset
- Custom cursor hidden when `prefers-reduced-motion`
- All `<img>` have descriptive `alt`
- Inputs have associated `<label>` (not just placeholders)
- Section heading hierarchy: 1× h1 (hero), h2 for sections
- WCAG AA contrast minimum:
  - cream on espresso ✓
  - amber on espresso ✓ (large text only — never small body text in amber)
  - cream/70 on espresso ✓ (passes for body)

---

## Brand Patterns to Reuse

### "Section opener" formula
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

### "Ghost number" decoration
```tsx
<span className="absolute bottom-0 right-2 font-serif2 text-[8rem] font-black opacity-[0.05] text-cream pointer-events-none leading-none">
  01
</span>
```

### "Card with hover lift"
```tsx
<motion.div
  className="group relative bg-card-bg border border-card-border p-6 md:p-10"
  whileHover={{ y: -4 }}
  transition={{ duration: 0.35, ease: 'easeOut' }}
>
```

---

## File Naming

- Components: `PascalCase.tsx` — `HeroSection.tsx`, `FeatureCard.tsx`
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- API routes: always `route.ts`
- Translation keys: `dot.snake_case` — `hero.title_line1`
- Supabase tables: `snake_case_plural` — `waitlist_entries`

---

## What NOT to do

- Don't use `pages/` router — App Router only
- Don't import fonts via `<link>` — use `next/font`
- Don't use `any` TS — use `unknown` and narrow
- Don't inline styles for static values — use Tailwind
- Don't animate layout properties — only transform/opacity
- Don't use `useEffect` for data fetching — RSC or SWR
- Don't store secrets in `NEXT_PUBLIC_` env vars
- Don't use rounded corners > 20px on major cards
- Don't use any colour outside the palette as accent
- Don't use em dashes (—) in JSON copy values — use commas/full stops
- Don't add images to the landing page (kept image-free for performance)

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 90 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| FID | < 100ms |
| Bundle (gzip) | < 200 KB JS |
| First Load JS | ~ 175 KB current |

---

## Summary in 3 sentences

Karu is a dark, premium, amber-accented car rental landing page for Cameroon. It uses Playfair Display for hero headlines, DM Serif Display for sections, and DM Sans for body. Every interaction is GPU-accelerated, every section has a tagged-and-emphasised opener, and the whole thing is image-free with controlled motion that respects reduced-motion preferences.
