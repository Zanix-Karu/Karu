---
inclusion: always
---

# Zanix — Tech Stack (Landing Page & Web)

## Framework: Next.js 14 (App Router)

The Zanix landing page and web presence are built with **Next.js 14** using the App Router pattern.

**Why Next.js:**
- Server-side rendering for SEO-critical pages (landing, city pages, blog)
- API Routes for waitlist form submission and Supabase integration
- Image optimisation built-in (`next/image`) — critical for car photos on slow African networks
- Incremental Static Regeneration for listing pages
- TypeScript-first with excellent DX

**Core dependencies:**
```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "typescript": "^5.4.0",
  "@supabase/supabase-js": "^2.43.0",
  "framer-motion": "^11.0.0",
  "tailwindcss": "^3.4.0",
  "@tailwindcss/typography": "^0.5.0"
}
```

## Styling: Tailwind CSS + CSS Variables

Use **Tailwind CSS** for utility-first styling, extended with custom design tokens in `tailwind.config.ts`.

**Design token conventions:**
```ts
// tailwind.config.ts — extend theme with Zanix tokens
colors: {
  espresso: '#1C1208',
  'brown-dark': '#2A1A0A',
  'brown-mid': '#3D2510',
  'brown-warm': '#5C3A1E',
  surface: '#231508',
  'card-bg': '#2E1C0D',
  amber: '#E8A020',
  'amber-light': '#F5BF45',
  cream: '#F5EFE4',
  white: '#FEFCF8',
}
```

CSS custom properties live in `app/globals.css`. Use them for values Tailwind can't reach (complex gradients, blend modes, backdrop filters).

## Animation: Framer Motion

Use **Framer Motion** for all interactive animations:
- `motion.div` with `viewport={{ once: true }}` for scroll-triggered reveals
- `AnimatePresence` for route transitions and modal entry/exit
- `useScroll` + `useTransform` for parallax effects
- Staggered children with `variants` and `staggerChildren`

**Performance rule**: Animate only `transform` and `opacity`. Never animate `width`, `height`, `top`, `left`, or layout-affecting properties.

## Backend: Supabase

All data persistence goes through **Supabase**.

```ts
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

**Landing page tables:**
- `waitlist_entries` — email, type (customer/vendor), city, created_at, ip_hash
- `page_analytics` — section_viewed, timestamp (lightweight, privacy-safe)

Server-side Supabase calls (admin operations, analytics writes) use the service role key in API Routes only — never exposed to the client.

## Fonts

Load via `next/font/google` — never via `<link>` tags (performance):

```ts
import { DM_Serif_Display, DM_Sans, Playfair_Display } from 'next/font/google'

export const dmSerif = DM_Serif_Display({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
})

export const playfair = Playfair_Display({
  weight: ['700', '900'],
  subsets: ['latin'],
  variable: '--font-serif2',
})

export const dmSans = DM_Sans({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-sans',
})
```

## Internationalisation: next-intl

Support French and English from day one using **next-intl**.

```
/messages
  en.json
  fr.json
/app
  /[locale]
    layout.tsx
    page.tsx
```

All user-facing strings are in translation files. No hardcoded copy in components.

## Forms: React Hook Form + Zod

```ts
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const WaitlistSchema = z.object({
  email: z.string().email(),
  type: z.enum(['customer', 'vendor']),
  city: z.enum(['douala', 'yaounde', 'other']),
})
```

Never use uncontrolled forms. All validation is Zod-first, shared between client and server (API Route).

## Email: Resend

Transactional email (waitlist confirmation, vendor onboarding) via **Resend** with React Email templates.

```ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
```

## Analytics: Plausible (Privacy-first)

Use **Plausible Analytics** — no cookies, GDPR-compliant, works without user consent banners. Track:
- `waitlist_signup` — type (customer/vendor), city
- `section_view` — which landing page sections users reach
- `cta_click` — which CTAs convert

## Environment Variables

```bash
# .env.local — never commit this file
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

`.env.example` must be kept in sync with all required variables — never expose service role keys to the client.

## Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 90 |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| First Input Delay | < 100ms |
| Bundle size (gzip) | < 150 KB JS |
| Images | WebP, `next/image`, lazy loaded |

## File Naming Conventions

- Components: `PascalCase.tsx` — e.g., `HeroSection.tsx`
- Hooks: `camelCase.ts` prefixed with `use` — e.g., `useScrollProgress.ts`
- Utils: `camelCase.ts` — e.g., `formatCurrency.ts`
- API Routes: `route.ts` inside `app/api/[endpoint]/`
- Types: `types.ts` or co-located with component

## DO NOT

- Do not use `pages/` router — use App Router exclusively
- Do not import fonts via `<link>` in `<head>` — use `next/font`
- Do not use `any` TypeScript type — use `unknown` and narrow properly
- Do not inline styles — use Tailwind or CSS variables
- Do not use `useEffect` for data fetching — use React Server Components or SWR
- Do not animate layout properties — animate transform/opacity only
- Do not store secrets in `NEXT_PUBLIC_` prefixed variables
