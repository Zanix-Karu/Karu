# Landing Page — Implementation Tasks

> Checkboxes track completion. Each task references the requirements it satisfies.
> Work through phases in order — Phase 1 must be complete before Phase 2 begins.

---

## Phase 1: Project Scaffold

- [x] **1.1** Initialise Next.js 14 project with TypeScript and App Router
  `npx create-next-app@latest zanix-web --typescript --tailwind --app --src-dir=false`
  _Requirements: NFR-1, NFR-3_

- [x] **1.2** Install all core dependencies
  ```bash
  npm install framer-motion @supabase/supabase-js next-intl react-hook-form @hookform/resolvers zod resend
  npm install -D @tailwindcss/typography vitest @playwright/test
  ```
  _Requirements: tech.md stack_

- [x] **1.3** Configure `tailwind.config.ts` with Zanix design tokens (all colour variables, font families, custom animations)
  _Requirements: landing-page.md colour tokens_

- [x] **1.4** Set up `app/globals.css` with all CSS custom properties from `landing-page.md`
  _Requirements: landing-page.md_

- [x] **1.5** Configure font loading in `app/[locale]/layout.tsx` using `next/font/google` for DM Serif Display, Playfair Display, and DM Sans
  _Requirements: tech.md fonts_

- [x] **1.6** Create `.env.example` with all required variable names (no values)
  _Requirements: security.md prohibition #10_

- [x] **1.7** Set up `next.config.ts` with all security headers from `security.md`
  _Requirements: security.md HTTP headers_

- [x] **1.8** Set up `next-intl` with `en.json` and `fr.json` containing all landing page copy keys
  _Requirements: FR-8, NFR-4_

- [x] **1.9** Create `lib/animations.ts` with all shared Framer Motion variants: `fadeUp`, `fadeLeft`, `fadeRight`, `staggerContainer`, `cardHover`
  _Requirements: landing-page.md animation library_

- [x] **1.10** Create `lib/validations.ts` with shared `WaitlistSchema` Zod schema
  _Requirements: FR-6, api-standards.md_

---

## Phase 2: UI Primitives

- [x] **2.1** Build `components/ui/Button.tsx` — primary and ghost variants with all hover states
  _Requirements: landing-page.md button variants_

- [x] **2.2** Build `components/ui/Input.tsx` — email input with amber focus ring and error state
  _Requirements: FR-6, landing-page.md_

- [x] **2.3** Build `components/ui/ScrollReveal.tsx` — wraps children with Framer Motion viewport-triggered animation, supports `direction` and `delay` props, respects `prefers-reduced-motion`
  _Requirements: FR-5, NFR-2_

- [x] **2.4** Build `components/ui/AnimatedCounter.tsx` — animates a number from 0 to target using `requestAnimationFrame` and quartic ease-out, triggered by `IntersectionObserver`, fires only once
  _Requirements: FR-4_

- [x] **2.5** Build `components/ui/Ticker.tsx` — duplicated content for seamless loop, CSS animation, pauses on hover
  _Requirements: FR-3_

- [x] **2.6** Build `components/ui/CustomCursor.tsx` — amber dot + lagging circle, hover expansion via body class, disabled on touch devices and reduced-motion
  _Requirements: FR-7, NFR-2_

- [x] **2.7** Build `components/layout/Navigation.tsx` — transparent default, blurred dark on scroll, smooth section links, "Pre-Register" CTA scrolls to waitlist and focuses email input, mobile: hide links
  _Requirements: FR-1_

- [x] **2.8** Build `components/layout/LocaleSwitcher.tsx` — EN/FR toggle, preserves scroll position
  _Requirements: FR-8_

---

## Phase 3: Landing Page Sections

- [x] **3.1** Build `HeroSection.tsx` — full viewport section with: espresso gradient background, SVG grid overlay with mouse parallax, streak animations, floating SVG car, animated pill badge, staggered headline + eyebrow + description + CTAs, scroll hint
  _Requirements: FR-2, NFR-2_

  Acceptance criteria:
  - Headline text matches copy in `en.json` / `fr.json`
  - "List Your Car →" button passes `?type=vendor` intent to waitlist section
  - All animations skip when `prefers-reduced-motion` is set
  - Parallax effect only on pointer devices

- [x] **3.2** Build `TickerBand.tsx` — amber background, DM Sans 700 uppercase text, 8 phrases with ✦ separators, seamless 22s loop, hover pauses
  _Requirements: FR-3_

- [x] **3.3** Build `StatsRow.tsx` — 4-cell grid: `500+ Pre-registered vendors`, `2 cities`, `100% Verified providers`, `24/7 Support`. Each cell with AnimatedCounter, amber underline reveal, staggered entry
  _Requirements: FR-4_

- [x] **3.4** Build `AboutSection.tsx` — 2-column layout: left column has section tag + heading + 2 paragraphs + CTA button; right column has 2×2 grid of small cards + 1 full-width card
  _Requirements: FR-5, landing-page.md cards_

  Card contents:
  - 📍 Launching first in: Douala, Yaoundé
  - 🎯 Focused on: Airport Pickups, Arriving Travelers, Diaspora Visitors
  - 👥 For everyone: Tourists, Business Travelers, Locals
  - ✅ Core promise: Verified Providers, Transparent Pricing, Pre-Arrival Lock-in
  - Full-width: "The demand and supply is real — the structure and trust are missing."

- [x] **3.5** Build `HowItWorksSection.tsx` — 4 steps in a grid with amber connecting line, diamond number icons with rotation on hover, staggered reveals
  _Requirements: FR-11_

  Steps:
  1. Search — Browse verified vehicles, filter by type, price, pickup location
  2. Request — Send booking request before you land
  3. Confirm — Vendor approves in 24hrs, pay via MTN MoMo or Orange Money
  4. Drive — Arrive, collect your car. Leave a review when done.

- [x] **3.6** Build `FeaturesGrid.tsx` — 3×2 grid of feature cards, each with: top amber bar hover animation, icon, uppercase label, description, ghost number
  _Requirements: FR-10_

  Features:
  1. 🛡️ Verified Vendors — identity-checked before going live
  2. 📱 WhatsApp Integration — verified layer on top of familiar habits
  3. 💳 Mobile Money Payments — MTN MoMo or Orange Money, no card required
  4. ✈️ Pre-Arrival Booking — lock in your car from anywhere in the world
  5. ⭐ Reviews & Reputation — two-sided accountability system
  6. 🚗 Driver Add-ons — Phase 2: driver services, long-term rentals, insurance

- [x] **3.7** Build `CitiesSection.tsx` — 2 city cards side by side: Douala (left slide in) and Yaoundé (right slide in), with ghost city codes, amber glow on hover, coordinates, "Launching First" badge
  _Requirements: FR-9_

- [x] **3.8** Build `FooterSection.tsx` — logo, nav links (Privacy, Terms, Contact, Instagram), copyright line
  _Requirements: general_

---

## Phase 4: Waitlist Section & Form

- [x] **4.1** Build `WaitlistSection.tsx` with full form state machine (`idle → loading → success/error`)
  _Requirements: FR-6, api-standards.md waitlist spec_

  Form fields:
  - Email input (full width)
  - Type segmented control: Customer / Vendor
  - City select (shown after type selected): Douala / Yaoundé / Other

  Success state includes:
  - Amber checkmark icon
  - Personalised message using city: "You're in! We'll notify you when we launch in [City]."
  - For "Other": "You're in! We'll notify you when Zanix comes to your city."

- [x] **4.2** Add live waitlist count display below the form
  Fetch from `/api/waitlist/count` on mount (SWR with 60s revalidation). Display as: "Join [count] others already on the waitlist"
  _Requirements: FR-6_

- [x] **4.3** Implement "List Your Car →" → vendor pre-select flow
  Hero button → scroll to waitlist → auto-select "Vendor" in type toggle
  _Requirements: FR-2, FR-6_

- [x] **4.4** Implement form success → error animation transition (300ms fade out → fade in)
  _Requirements: FR-6_

---

## Phase 5: API Routes

- [x] **5.1** Build `app/api/waitlist/route.ts` — POST handler with rate limiting, Zod validation, Supabase upsert, Resend confirmation email (non-blocking), Plausible event tracking
  _Requirements: FR-6, api-standards.md_

- [x] **5.2** Build `app/api/waitlist/count/route.ts` — GET handler returning total count, cached 60 seconds with `Cache-Control` header and Next.js `revalidate`
  _Requirements: FR-6_

- [x] **5.3** Build `lib/rate-limit.ts` — Upstash Redis or Vercel KV based rate limiter, returns `{ success: boolean, retryAfter: number }`
  _Requirements: security.md rate limiting_

- [x] **5.4** Build `lib/crypto.ts` — `hashIp(ip: string): Promise<string>` using `crypto.subtle.digest('SHA-256')` with a salt from `process.env.IP_HASH_SALT`
  _Requirements: security.md PII handling_

- [x] **5.5** Create Resend email template `emails/WaitlistConfirmEmail.tsx` in React Email — bilingual, branded with Zanix amber colour scheme
  _Requirements: FR-6_

---

## Phase 6: Supabase Setup

- [x] **6.1** Create `waitlist_entries` table with schema from `design.md`, indexes, and RLS policies
  _Requirements: design.md Supabase schema, security.md_

- [x] **6.2** Create `lib/supabase.ts` (public client with anon key) and `lib/supabase-admin.ts` (server-only with service role key, guarded against client import)
  _Requirements: tech.md, security.md prohibition #20_

- [x] **6.3** Add `lib/supabase-admin.ts` guard — throw error if imported in client context:
  ```ts
  if (typeof window !== 'undefined') {
    throw new Error('supabase-admin must not be imported client-side')
  }
  ```
  _Requirements: security.md prohibition #20_

---

## Phase 7: Internationalisation

- [x] **7.1** Complete `messages/en.json` with all landing page copy
  _Requirements: NFR-4_

- [x] **7.2** Complete `messages/fr.json` with French translations — parity check: every en key must exist in fr
  _Requirements: NFR-4_

- [x] **7.3** Add CI check to verify translation key parity between `en.json` and `fr.json`
  _Requirements: structure.md_

---

## Phase 8: Performance & SEO

- [x] **8.1** Add full `metadata` export to `app/[locale]/layout.tsx` — title, description, OpenGraph, Twitter card, robots
  _Requirements: design.md SEO_

- [x] **8.2** Create `/public/og/og-image.png` — 1200×630px, dark espresso background, Zanix amber logo, tagline
  _Requirements: design.md SEO_

- [x] **8.3** Add Plausible Analytics script via `next/script` with `strategy="lazyOnload"`, track `waitlist_signup` and `cta_click` events
  _Requirements: tech.md analytics, NFR-5_

- [x] **8.4** Run Lighthouse CI locally and fix any issues causing score below 90
  _Requirements: NFR-1_

- [x] **8.5** Add `robots.txt` and `sitemap.xml` generation via `app/robots.ts` and `app/sitemap.ts`
  _Requirements: design.md SEO_

---

## Phase 9: Testing

- [x] **9.1** Write Vitest unit tests for `WaitlistSchema`, `hashIp`, and counter easing function
  _Requirements: design.md testing_

- [x] **9.2** Write Playwright integration test for full waitlist form happy path with mocked API
  _Requirements: design.md testing, FR-6_

- [x] **9.3** Write Playwright test for keyboard navigation through all interactive elements
  _Requirements: NFR-2_

- [x] **9.4** Configure Lighthouse CI to run on every PR via GitHub Actions, fail below 88 performance score
  _Requirements: NFR-1_

---

## Phase 10: Pre-Launch Checklist

- [x] **10.1** Verify all environment variables are set in production (Vercel dashboard)
- [x] **10.2** Verify HSTS header is present in production response
- [x] **10.3** Run `npm audit` — zero high/critical vulnerabilities
- [x] **10.4** Verify custom cursor is disabled on mobile devices
- [x] **10.5** Test waitlist form submission end-to-end on production (use a test email)
- [x] **10.6** Test French locale — verify all copy is translated and layout holds
- [x] **10.7** Test on real Android device at 3G simulation — LCP under 2.5s
- [x] **10.8** Verify Supabase RLS — confirm anon key cannot read waitlist data
- [x] **10.9** Verify Resend confirmation email renders correctly on Gmail, Apple Mail, Outlook
- [x] **10.10** Verify `Content-Security-Policy` header does not block any resources in production
