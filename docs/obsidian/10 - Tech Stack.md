---
tags: [karu, engineering, tech, foundation]
created: 2026-05-10
---

# Tech Stack

## Framework

**Next.js 14 (App Router)** with TypeScript.

Why Next.js:
- Server-side rendering for SEO
- API routes for backend
- `next/font` and `next/image` built in
- TypeScript-first DX
- Excellent Vercel integration

## Core Dependencies

```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "typescript": "^5.4.0",
  "tailwindcss": "^3.4.0",
  "framer-motion": "^11.0.0",
  "next-intl": "^4.x",
  "@supabase/supabase-js": "^2.43.0",
  "resend": "^x",
  "zod": "^x",
  "swr": "^x",
  "@marsidev/react-turnstile": "^x",
  "@vercel/speed-insights": "^x",
  "leaflet": "^x"
}
```

## Services

| Service | Purpose | Tier |
|---------|---------|------|
| [[30 - Deployment#Vercel|Vercel]] | Hosting | Free/Pro |
| [[12 - Database Schema|Supabase]] | Postgres database | Free |
| [[34 - Email System|Resend]] | Transactional email | Free (3K/mo) |
| [[30 - Deployment#Cloudflare|Cloudflare]] | DNS, CDN, SSL, Email Routing | Free |
| Plausible | Analytics | $9/mo |
| Vercel Speed Insights | Core Web Vitals | Free |

## Styling

**Tailwind CSS** + custom CSS variables.

- Design tokens in `tailwind.config.ts`
- CSS custom properties in `app/globals.css` for values Tailwind can't reach
- See [[20 - Design System]]

## Animation

**Framer Motion** for complex interactions, **CSS keyframes** for simple loops.

- Variants library at `lib/animations.ts`
- Always animate only `transform` and `opacity`
- Respect `prefers-reduced-motion`

## Forms

Controlled state + **Zod** validation. (No react-hook-form — caused issues with conditional schemas.)

## Internationalisation

**next-intl** — supports English and French.

- Locale routing: `/en/...`, `/fr/...`
- Translation files in `messages/`
- Configured in `i18n/request.ts`

## Fonts

Loaded via `next/font/google` with `display: swap`:

- DM Serif Display (`--font-dm-serif`)
- Playfair Display (`--font-playfair`)
- DM Sans (`--font-dm-sans`)

See [[20 - Design System#Typography]]

## Email

**Resend** for sending transactional emails.

- React Email components for templates
- Branded with Karu colours
- Bilingual (EN/FR)

See [[34 - Email System]]

## Database

**Supabase** (Postgres) with Row Level Security.

- Tables: `waitlist_entries`, `admin_email_log`
- See [[12 - Database Schema]]

## Security

- Cloudflare Turnstile (CAPTCHA)
- HMAC-SHA256 IP hashing
- AES encryption for email logs
- JWT for admin auth

See [[32 - Security]]

## Folder Structure

See [[14 - Folder Structure]]
