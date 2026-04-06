---
inclusion: always
---

# Zanix — Project Structure

## Repository Root

```
zanix-web/
├── .kiro/                        # AI steering, specs, hooks
│   ├── steering/
│   ├── specs/
│   └── hooks/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # i18n root (en | fr)
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Landing page
│   │   ├── vendors/
│   │   │   └── page.tsx          # Vendor sign-up landing
│   │   └── cities/
│   │       └── [city]/
│   │           └── page.tsx      # City-specific pages
│   └── api/
│       ├── waitlist/
│       │   └── route.ts          # POST — join waitlist
│       └── analytics/
│           └── route.ts          # POST — track events
├── components/
│   ├── landing/                  # Landing page sections
│   │   ├── HeroSection.tsx
│   │   ├── StatsRow.tsx
│   │   ├── AboutSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── FeaturesGrid.tsx
│   │   ├── CitiesSection.tsx
│   │   ├── WaitlistSection.tsx
│   │   └── FooterSection.tsx
│   ├── ui/                       # Reusable primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── AnimatedCounter.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── Ticker.tsx
│   │   └── CustomCursor.tsx
│   └── layout/
│       ├── Navigation.tsx
│       └── LocaleSwitcher.tsx
├── lib/
│   ├── supabase.ts               # Supabase client (public)
│   ├── supabase-admin.ts         # Supabase admin (server-only)
│   ├── analytics.ts              # Plausible event helpers
│   └── validations.ts            # Shared Zod schemas
├── hooks/
│   ├── useScrollProgress.ts
│   ├── useInView.ts
│   └── useMediaQuery.ts
├── messages/
│   ├── en.json                   # English copy
│   └── fr.json                   # French copy
├── public/
│   ├── fonts/                    # Self-hosted fallbacks only
│   ├── images/
│   │   ├── cars/                 # Optimised WebP car images
│   │   └── cities/               # Douala, Yaoundé imagery
│   └── og/
│       └── og-image.png          # Open Graph image (1200×630)
├── styles/
│   └── globals.css               # CSS custom properties + base
├── types/
│   └── index.ts                  # Shared TypeScript types
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── .env.example
```

## Naming Rules

| Type | Convention | Example |
|---|---|---|
| React components | PascalCase | `HeroSection.tsx` |
| Custom hooks | camelCase, `use` prefix | `useScrollProgress.ts` |
| Utility functions | camelCase | `formatCurrency.ts` |
| API route files | always `route.ts` | `app/api/waitlist/route.ts` |
| Translation keys | dot-separated snake_case | `hero.cta_primary` |
| CSS classes | Tailwind utilities only | — |
| CSS variables | `--color-amber`, `--font-serif` | kebab-case with prefix |
| Supabase tables | snake_case, plural | `waitlist_entries` |
| Environment vars | SCREAMING_SNAKE_CASE | `RESEND_API_KEY` |

## Component Architecture Rules

### Server vs. Client Components

Prefer **React Server Components** (RSC) by default. Only add `'use client'` when you need:
- `useState` or `useReducer`
- Browser APIs (`window`, `document`, `IntersectionObserver`)
- Event listeners
- Framer Motion animations (Motion components require client)

**Pattern**: Keep RSC as the shell, push interactivity into small leaf client components.

```tsx
// ✅ Correct — server shell, client leaf
// HowItWorksSection.tsx (RSC)
import { StepCard } from './StepCard' // RSC
import { StepAnimationWrapper } from './StepAnimationWrapper' // 'use client'

// ❌ Wrong — entire section is client for one animation
'use client'
export function HowItWorksSection() { ... }
```

### Props and Types

All component props must have explicit TypeScript interfaces:

```tsx
interface HeroSectionProps {
  locale: 'en' | 'fr'
  initialWaitlistCount?: number
}

export function HeroSection({ locale, initialWaitlistCount = 500 }: HeroSectionProps) {
  // ...
}
```

### Animation Components

All scroll-triggered animations use the `ScrollReveal` wrapper component:

```tsx
// components/ui/ScrollReveal.tsx
'use client'
import { motion } from 'framer-motion'

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: 'up' | 'left' | 'right'
  delay?: number
}
```

Never inline Framer Motion variants in section components — import from `lib/animations.ts`.

## API Routes

All API routes follow this pattern:

```ts
// app/api/waitlist/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = WaitlistSchema.parse(body)
    // ... process
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

- Always validate with Zod before any DB operation
- Always return typed JSON responses
- Never expose stack traces
- Rate limit sensitive endpoints (use Upstash Redis or Vercel KV)

## Translation File Structure

```json
// messages/en.json
{
  "nav": {
    "about": "About",
    "how_it_works": "How it works",
    "features": "Features",
    "cities": "Cities",
    "cta": "Pre-Register"
  },
  "hero": {
    "pill": "Douala & Yaoundé · Launching Soon",
    "title_line1": "Book Trusted",
    "title_line2": "Rental Cars",
    "title_line3": "in Cameroon",
    "eyebrow": "Before You Arrive",
    "description": "Zanix connects travelers, diaspora, and locals with verified car rental providers in Douala and Yaoundé. No stress, no middlemen, no surprises.",
    "cta_primary": "Pre-Register Now",
    "cta_secondary": "List Your Car →"
  }
}
```

Every key in `en.json` must have a corresponding key in `fr.json`. Missing keys are a CI failure.

## Git Conventions

- Branch: `feat/section-name`, `fix/bug-description`, `chore/task-name`
- Commits: Conventional Commits — `feat(hero): add animated counter`, `fix(form): correct email validation`
- Never commit `.env.local` — only `.env.example`
- PR requires passing CI (type check, lint, build) before merge
