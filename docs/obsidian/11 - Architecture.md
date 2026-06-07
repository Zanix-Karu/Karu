---
tags: [karu, engineering, architecture]
created: 2026-05-10
---

# Architecture

## System Overview

```mermaid
graph TB
  User[User Browser]
  CF[Cloudflare<br/>DNS + CDN + WAF]
  Vercel[Vercel<br/>Next.js App]
  SB[(Supabase<br/>Postgres)]
  Resend[Resend<br/>Email API]
  CFE[Cloudflare<br/>Email Routing]
  Gmail[Gmail Inbox]
  Plausible[Plausible<br/>Analytics]
  Turnstile[Cloudflare<br/>Turnstile]

  User -->|HTTPS| CF
  CF -->|proxy| Vercel
  Vercel -->|service_role| SB
  Vercel -->|API| Resend
  Vercel -->|verify token| Turnstile
  Vercel -->|event| Plausible
  Resend -->|noreply@| User
  User -->|hello@| CFE
  CFE -->|forward| Gmail
```

## Request Flow — Waitlist Submission

1. User fills form on landing page
2. Cloudflare Turnstile widget verifies user is human
3. Form sends POST to `/api/waitlist` with token
4. Vercel function validates origin, CSRF header, content-type, payload size
5. Server verifies Turnstile token with Cloudflare
6. Zod sanitises and validates fields
7. IP hashed with HMAC-SHA256
8. Insert into Supabase `waitlist_entries` (upsert, ignore duplicates)
9. Resend sends bilingual confirmation email (Karu template)
10. Plausible event fired (no PII)
11. Success response → animated checkmark in UI

See [[13 - API Routes]] and [[12 - Database Schema]]

## Request Flow — Admin Access

1. Admin logs in at `/admin/login`
2. Server validates against bcrypt-hashed credentials
3. JWT issued and set as `karu_admin` cookie (HTTP-only)
4. Middleware checks cookie on every `/admin/*` request
5. Admin pages query `/api/admin/data` etc.

## Middleware Logic

```
/api/* → bypass i18n, return next()
/admin/* → check JWT, redirect to login if invalid
/maintenance → block when MAINTENANCE_MODE != 'true'
* → if MAINTENANCE_MODE='true', rewrite to /maintenance
* → otherwise apply next-intl locale routing
```

See `middleware.ts` in repo.

## Data Flow

### What's stored
- Waitlist entries (in [[12 - Database Schema|Supabase]])
- Email log (encrypted bodies)
- Analytics events (in Plausible, no PII)

### What's NOT stored
- Raw IPs (hashed with HMAC-SHA256)
- Plain-text email content (AES encrypted)
- Passwords (bcrypt hashed)

## Edge Optimisations

- Vercel geo headers populate country/lat/lng on each request
- Static pages (privacy, terms, contact) prerendered
- API routes run as Edge functions where possible
- Cloudflare proxies all traffic (DDoS protection, caching)

## Scaling Considerations

Currently: single-region Vercel deployment, single Supabase instance.

Future:
- Move rate limiting to Upstash Redis (currently in-memory, unreliable on serverless)
- Read replicas in Supabase if traffic grows
- CDN-cached API responses for `/api/waitlist/count`

See [[42 - Known Constraints]]
