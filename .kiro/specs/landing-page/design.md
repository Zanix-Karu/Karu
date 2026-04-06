# Landing Page — Technical Design

## Architecture Overview

The landing page is a Next.js 14 App Router page with the following rendering strategy:

- **Shell (RSC)**: `app/[locale]/page.tsx` — renders static section shells, fetches initial waitlist count via `fetch()` with `revalidate: 60`
- **Interactive leaves (Client Components)**: Custom cursor, animated counters, waitlist form, locale switcher, parallax effects
- **API Routes**: `/api/waitlist` (POST, rate-limited), `/api/waitlist/count` (GET, cached)

```
app/
  [locale]/
    page.tsx                     ← RSC shell, assembles all sections
    layout.tsx                   ← Font loading, metadata, script tags

components/landing/
  HeroSection.tsx                ← RSC + client AnimatedHeroContent
  TickerBand.tsx                 ← 'use client' (animation)
  StatsRow.tsx                   ← RSC + client AnimatedCounter leaves
  AboutSection.tsx               ← RSC + client ScrollReveal wrappers
  HowItWorksSection.tsx          ← RSC + client StepCard hover states
  FeaturesGrid.tsx               ← RSC + client FeatureCard hover states
  CitiesSection.tsx              ← RSC + client CityCard hover states
  WaitlistSection.tsx            ← 'use client' (form state)
  FooterSection.tsx              ← RSC

components/ui/
  CustomCursor.tsx               ← 'use client', renders null on touch devices
  Navigation.tsx                 ← 'use client' (scroll-based stuck state)
  ScrollReveal.tsx               ← 'use client' (Framer Motion viewport)
  AnimatedCounter.tsx            ← 'use client' (requestAnimationFrame)
  Ticker.tsx                     ← 'use client' (CSS animation)
  LocaleSwitcher.tsx             ← 'use client' (next-intl)
  Button.tsx                     ← RSC (no state)
  Input.tsx                      ← RSC (no state)
```

---

## Component Design

### `HeroSection.tsx`

```tsx
// RSC shell
export async function HeroSection({ locale }: { locale: string }) {
  return (
    <section className="hero relative min-h-screen flex flex-col items-center justify-center">
      <HeroBackground />       {/* SVG + CSS gradients, pure RSC */}
      <AnimatedHeroContent locale={locale} />  {/* 'use client' */}
      <ScrollHint />           {/* RSC */}
    </section>
  )
}
```

`AnimatedHeroContent` uses `useReducedMotion()` from Framer Motion and renders the stagger sequence:

```tsx
'use client'
const shouldReduce = useReducedMotion()

const containerVariants = shouldReduce ? {} : staggerContainer
const itemVariants = shouldReduce ? {} : fadeUp
```

### `WaitlistSection.tsx` — State Machine

The form has five states managed by `useReducer`:

```ts
type WaitlistState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; city: string }
  | { status: 'error'; message: string }
  | { status: 'duplicate' }  // treated same as success in UI

type WaitlistAction =
  | { type: 'SUBMIT' }
  | { type: 'SUCCESS'; city: string }
  | { type: 'ERROR'; message: string }
  | { type: 'RESET' }
```

Pre-selecting vendor type from hero CTA: the `List Your Car →` button passes `?type=vendor` in the scroll hash. `WaitlistSection` reads `searchParams` on mount with `useSearchParams()` and pre-sets the type field.

### `AnimatedCounter.tsx`

Uses `requestAnimationFrame` (not `setInterval`) for smooth counting:

```ts
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

// Triggered by IntersectionObserver via ScrollReveal parent
// Runs once, never re-triggers
```

### `CustomCursor.tsx`

Two elements: a small dot tracking exact mouse position (no lag) and a larger circle that uses `lerp` interpolation (lag factor: 0.14).

- Hidden by default on touch devices (`window.matchMedia('(pointer: coarse)')`)
- Disabled when `prefers-reduced-motion: reduce`
- Body class `hovering` added/removed on interactive element enter/leave — triggers CSS transition on circle size

---

## Sequence Diagram: Waitlist Form Submission

```
User                 WaitlistSection          /api/waitlist          Supabase          Resend
  |                        |                        |                     |               |
  |--- submit(email, ----->|                        |                     |               |
  |    type, city)         |                        |                     |               |
  |                  validate(Zod)                  |                     |               |
  |                  [invalid] → show error         |                     |               |
  |                  [valid] → dispatch SUBMIT       |                     |               |
  |                        |--- POST /api/waitlist ->|                     |               |
  |                        |                  validate(Zod)               |               |
  |                        |                  rateLimit(IP)               |               |
  |                        |                        |-- upsert email ----->|               |
  |                        |                        |<-- { id } ----------|               |
  |                        |                        |-- send confirm email--------------->|
  |                        |                        |<-- { id } --------------------------
  |                        |<-- 201 { success } ----|                     |               |
  |                  dispatch SUCCESS(city)          |                     |               |
  |<-- success state ------|                        |                     |               |
```

---

## API Route: `/api/waitlist`

```ts
// app/api/waitlist/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/rate-limit'
import { hashIp } from '@/lib/crypto'

const WaitlistSchema = z.object({
  email: z.string().email().max(254).toLowerCase().trim(),
  type: z.enum(['customer', 'vendor']),
  city: z.enum(['douala', 'yaounde', 'other']),
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-only key
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  // Rate limit: 3 per hour per IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const limited = await rateLimit(`waitlist:${await hashIp(ip)}`, 3, 3600)
  if (!limited.success) {
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' }},
      { status: 429, headers: { 'Retry-After': '3600' }}
    )
  }

  // Parse
  let body: unknown
  try { body = await request.json() }
  catch { return NextResponse.json({ success: false, error: { code: 'INVALID_JSON', message: 'Invalid JSON' }}, { status: 400 }) }

  const parsed = WaitlistSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid data', fields: parsed.error.issues }},
      { status: 400 }
    )
  }

  const { email, type, city } = parsed.data

  // Upsert (ignore conflict — don't reveal duplicate)
  const { error: dbError } = await supabase
    .from('waitlist_entries')
    .upsert({ email, type, city, ip_hash: await hashIp(ip) }, { onConflict: 'email', ignoreDuplicates: true })

  if (dbError) {
    console.error('[waitlist] DB error:', dbError.message)
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An error occurred' }}, { status: 500 })
  }

  // Send confirmation (non-blocking — don't fail the response if email fails)
  resend.emails.send({
    from: 'Zanix <hello@zanix.cm>',
    to: email,
    subject: type === 'vendor'
      ? 'You\'re registered — Zanix vendor early access'
      : 'You\'re on the list — Zanix launches soon',
    react: WaitlistConfirmEmail({ type, city }),
  }).catch(err => console.error('[waitlist] Email error:', err))

  return NextResponse.json({ success: true, data: { message: "You\'re on the list!" }}, { status: 201 })
}
```

---

## Supabase Schema

```sql
-- Run in Supabase SQL Editor

CREATE TABLE waitlist_entries (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('customer', 'vendor')),
  city        TEXT NOT NULL CHECK (city IN ('douala', 'yaounde', 'other')),
  ip_hash     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email)
);

-- Indexes
CREATE INDEX idx_waitlist_type ON waitlist_entries(type);
CREATE INDEX idx_waitlist_city ON waitlist_entries(city);
CREATE INDEX idx_waitlist_created ON waitlist_entries(created_at DESC);

-- Row Level Security
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Public can insert only (no read, no update, no delete)
CREATE POLICY "public_insert_only" ON waitlist_entries
  FOR INSERT TO anon WITH CHECK (true);

-- Service role has full access (for admin dashboard, email sends)
-- No additional policy needed — service_role bypasses RLS
```

---

## Error Handling Strategy

| Scenario | User sees | Logged |
|---|---|---|
| Zod validation fails client-side | Inline field error | No |
| Rate limit hit | "Too many attempts. Try again later." | Yes (IP hash) |
| DB insert fails | "Something went wrong. Please try again." | Yes (error message, no PII) |
| Email send fails | Success (user still on list) | Yes (warning) |
| Network timeout | "Something went wrong. Please try again." | No |

---

## SEO & Metadata

```tsx
// app/[locale]/layout.tsx
export const metadata: Metadata = {
  title: 'Zanix — Book Trusted Rental Cars in Cameroon',
  description: 'Zanix connects travelers and locals with verified car rental providers in Douala and Yaoundé. Pre-register for early access.',
  openGraph: {
    title: 'Zanix — Book Trusted Rental Cars in Cameroon',
    description: 'No stress, no middlemen. Verified providers, mobile money payments.',
    images: [{ url: '/og/og-image.png', width: 1200, height: 630 }],
    locale: 'en_CM',
    alternateLocale: ['fr_CM'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zanix — Cameroon Car Rental Marketplace',
  },
  robots: { index: true, follow: true },
}
```

---

## Testing Strategy

### Unit Tests (Vitest)

- `WaitlistSchema` validation — valid and invalid inputs
- `AnimatedCounter` — easing function output at t=0, t=0.5, t=1
- `hashIp` — deterministic, non-reversible output

### Integration Tests (Playwright)

- Full waitlist form happy path (mock API)
- Form validation error states
- Locale switch preserves scroll position
- Keyboard navigation through all interactive elements

### Visual Regression (Playwright screenshots)

- Hero section at 1440px, 768px, 375px
- All six feature cards hovered
- Success state of waitlist form

### Performance (Lighthouse CI)

- Run on every PR targeting `main`
- Fail if Performance score drops below 88 (warn if below 92)
