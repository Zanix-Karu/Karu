# Karu — Project Context

## Overview
Karu (getkaru.io) is a verified car rental marketplace launching in Cameroon. Currently a pre-launch waitlist landing page with admin panel. Operates in Douala and Yaoundé.

- **Repo**: github.com/Zanix-Karu/Karu (branch: `main`)
- **Production**: https://getkaru.io (deployed on Vercel)
- **Languages**: English + French (next-intl)
- **Brand**: Dark espresso/brown palette with amber accent (#E8A020)

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom CSS variables |
| Animation | Framer Motion |
| Forms | Controlled state (no react-hook-form) + Zod validation |
| Database | Supabase (Postgres) with Row Level Security |
| Email | Resend (transactional) |
| Hosting | Vercel |
| DNS/CDN | Cloudflare (proxied) |
| Email routing | Cloudflare Email Routing → Gmail |
| Analytics | Plausible + Vercel Speed Insights |
| Maps | Leaflet (admin) |
| CAPTCHA | Cloudflare Turnstile |
| i18n | next-intl |
| Fonts | DM Serif Display, Playfair Display, DM Sans (next/font/google) |

## File Structure

```
app/
  [locale]/
    layout.tsx           — Root layout with metadata, fonts, SpeedInsights
    page.tsx             — Landing page with JSON-LD structured data
    contact/page.tsx
    privacy/page.tsx
    terms/page.tsx
  admin/
    (protected)/
      analytics/page.tsx
      dashboard/page.tsx
      emails/page.tsx
      map/page.tsx
      waitlist/page.tsx
      layout.tsx
    login/page.tsx
    layout.tsx
    page.tsx             — Redirects to /admin/dashboard
  api/
    admin/
      data/route.ts      — Get waitlist entries with filters
      emails/route.ts    — Email log retrieval
      login/route.ts     — Admin JWT login
      logout/route.ts
      send/route.ts      — Send single OR broadcast emails (Karu template)
    waitlist/
      route.ts           — POST: create waitlist entry, send confirm email
      count/route.ts     — GET: total signup count
  maintenance/
    layout.tsx
    page.tsx             — Animated maintenance page
  globals.css            — Design tokens, animations, mobile optimisations
  opengraph-image.tsx    — Dynamic OG image generation
  robots.ts              — Allows all bots including AI crawlers
  sitemap.ts             — Multi-locale sitemap

components/
  landing/               — All landing page sections
    HeroSection.tsx, AnimatedHeroContent.tsx (with social proof counter)
    TickerBand.tsx, AboutSection.tsx, HowItWorksSection.tsx, StepCard.tsx
    FeaturesGrid.tsx, FeatureCard.tsx
    CitiesSection.tsx, CityCard.tsx
    WaitlistSection.tsx — multi-step form (type → details), Turnstile integrated
    FooterSection.tsx
  admin/                 — Admin panel components
    Sidebar.tsx, MetricCard.tsx, TrendChart.tsx, MapView.tsx
    WaitlistTable.tsx, EmailCenter.tsx
  layout/
    Navigation.tsx, LocaleSwitcher.tsx
  ui/
    Button.tsx, Input.tsx, Icon.tsx, Ticker.tsx
    AnimatedCounter.tsx, ScrollReveal.tsx, BackToTop.tsx, CustomCursor.tsx

lib/
  supabase-admin.ts      — Server-side Supabase client (lazy init)
  validations.ts         — Zod schemas with input sanitisation
  crypto.ts              — HMAC-SHA256 IP hashing
  animations.ts          — Framer Motion variants
  email-template.ts      — Karu-branded email wrapper for admin emails
  email-encrypt.ts       — AES encryption for email log storage
  admin-auth.ts          — JWT auth helpers
  sentiment.ts           — Lead scoring (HOT/WARM/COLD tiers)
  rate-limit.ts          — In-memory (not used in serverless prod)

emails/
  WaitlistConfirmEmail.tsx — Bilingual confirmation email (473 lines, polished)

messages/
  en.json, fr.json       — All UI strings

supabase/migrations/
  001_waitlist_entries.sql  — Base table
  002_waitlist_karu.sql
  003_vendor_fields.sql     — business_name, business_email, phone, vehicle_count
  004_add_locale.sql
  005_add_geo_columns.sql   — country, region, city_geo, lat, lng
  006_email_log.sql         — admin_email_log table
  007_email_log_extended.sql

middleware.ts            — i18n routing + maintenance mode + admin auth
next.config.mjs          — Security headers, CSP, source map disabled
tailwind.config.ts       — Custom colour palette
i18n/request.ts          — next-intl config

public/
  llms.txt               — AI crawler summary
  llms-full.txt          — Detailed AI context (FAQs, citations)
  humans.txt
  .well-known/
    security.txt         — Security disclosure contact
    ai-plugin.json       — AI agent manifest
```

## Database Schema

### `waitlist_entries`
```sql
id UUID PRIMARY KEY
email TEXT UNIQUE NOT NULL
type TEXT CHECK (type IN ('customer', 'vendor'))
city TEXT CHECK (city IN ('douala', 'yaounde', 'other'))
locale TEXT DEFAULT 'en'
ip_hash TEXT          -- HMAC-SHA256
business_name TEXT    -- vendor only
business_email TEXT   -- vendor only
phone TEXT            -- vendor only
vehicle_count TEXT    -- vendor only ('1-5', '6-20', '21+')
country TEXT          -- from Vercel geo headers
region TEXT
city_geo TEXT
lat DOUBLE PRECISION
lng DOUBLE PRECISION
created_at TIMESTAMPTZ DEFAULT NOW()
```
RLS enabled: anon can INSERT only, service_role full access.

### `admin_email_log`
```sql
id UUID PRIMARY KEY
subject TEXT
recipient_count INT
segment JSONB
resend_id TEXT
sent_at TIMESTAMPTZ
html_encrypted TEXT   -- AES encrypted
html_iv TEXT
email_type TEXT       -- 'broadcast', 'single', 'customer_signup', 'vendor_signup'
```

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Email
RESEND_API_KEY=

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=getkaru.io

# Security
IP_HASH_SALT=                          # 64-char hex (openssl rand -hex 32)
EMAIL_LOG_ENCRYPTION_KEY=              # 32-byte base64
ADMIN_JWT_SECRET=                      # min 32 chars
ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=                   # bcrypt hash

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Optional
GOOGLE_SITE_VERIFICATION=
MAINTENANCE_MODE=true                  # to enable maintenance page
```

## Waitlist Form Flow

1. **Step 1**: User clicks "I'm a Customer" or "I'm a Vendor"
2. **Step 2 (Customer)**: Email + City → Submit
3. **Step 2 (Vendor)**: Email + City + Business Name + Business Email + Phone + Vehicle Count → Submit
4. Cloudflare Turnstile widget appears before submit (if env vars set)
5. Server validates origin, CSRF, content-type, payload size
6. Server verifies Turnstile token with Cloudflare
7. Zod sanitises and validates input (HTML stripped, dangerous chars removed)
8. Insert into Supabase with geo data from Vercel edge headers
9. Resend sends bilingual Karu-branded confirmation email
10. (If vendor) confirmation also CC'd to business_email
11. Plausible event fired (no PII)
12. Success animation with checkmark + city-specific message

## Admin Panel

Routes: `/admin/dashboard`, `/admin/waitlist`, `/admin/map`, `/admin/analytics`, `/admin/emails`

- JWT cookie auth (`karu_admin`)
- Lead scoring: each entry gets HOT/WARM/COLD tier based on profile completeness
- Map: Leaflet with dark theme tiles, pins for each waitlist entry
- Email Center: send single OR broadcast, wrapped in Karu template, encrypted log

## Security Hardening

- HSTS (2 year), CSP (strict whitelist), X-Frame-Options DENY
- Cross-Origin-* policies (same-origin)
- X-Powered-By stripped, source maps disabled in prod, console.log dropped
- React DevTools disabled in production
- IP hashing via HMAC-SHA256 (never raw)
- Origin + X-Requested-With CSRF check
- Field whitelist on POST body (rejects unknown keys)
- 5KB payload limit
- Method blocking (only POST allowed, others return 405)
- Cloudflare: Bot Fight Mode, AI Labyrinth, Turnstile, DMARC

## SEO/AI Optimisation

- Multilingual sitemap with hreflang
- 17 targeted keywords (English + French)
- 3 JSON-LD schemas: WebApplication, LocalBusiness, FAQPage
- llms.txt and llms-full.txt for AI crawlers
- robots.txt explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.

## Recent Issues Fixed

- ✅ Yellow streak flash on page load (added `opacity-0` Tailwind class)
- ✅ Vendor fields not appearing in form (rewrote with controlled state)
- ✅ API 404 (middleware was prefixing /api with locale)
- ✅ API 500 (DB insert had non-existent columns)
- ✅ Vercel preview CSRF block (now allows *.vercel.app)
- ✅ Phone number not showing in admin (was rendering checkmark only)
- ✅ Map missing coordinates (geo columns weren't being populated)
- ✅ Turnstile CSP block (added challenges.cloudflare.com to CSP)

## Known Constraints

- Rate limiting is in-memory only (doesn't work on Vercel serverless cold starts)
- Cloudflare Email Routing is one-way (can't read inbox programmatically)
- Lighthouse score not measurable locally (Chrome headless issues)
- DMARC record needs manual addition to Cloudflare DNS

## Brand Voice

- Confident, not arrogant
- Warm, not chatty
- British English in all copy
- Bilingual parity (FR equally complete as EN)
- "No stress, no hidden arrangements, no surprises"
- Local-first language (Douala, Yaoundé, MTN MoMo, FCFA naturally)

## Style Conventions

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Translation keys: `dot.snake_case`
- Supabase tables: snake_case plural
- Env vars: `SCREAMING_SNAKE_CASE`
- Animate only `transform` and `opacity`
- Respect `prefers-reduced-motion` everywhere
- Touch targets minimum 44px
- Dashes in JSON values replaced with commas/full stops
