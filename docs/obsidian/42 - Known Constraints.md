---
tags: [karu, constraints, process]
created: 2026-05-10
---

# Known Constraints

> Things we accept as limitations, with workarounds where possible.

## Rate Limiting Doesn't Work in Production

**Constraint**: `lib/rate-limit.ts` uses an in-memory `Map`. On Vercel serverless, each function invocation gets a fresh instance — the Map resets on every cold start.

**Workaround**: Currently no rate limiting. Cloudflare Bot Fight Mode + Turnstile mitigate abuse.

**Roadmap**: Move to Upstash Redis when traffic justifies the $10/month cost.

## Cloudflare Email Routing is One-Way

**Constraint**: Cloudflare Email Routing forwards emails but doesn't expose an API to read inbox.

**Workaround**: Read emails directly in Gmail. Don't try to integrate received emails into admin panel.

**Alternatives** (all paid/complex):
- Gmail API — requires OAuth setup, refresh token management
- Cloudflare Email Workers — requires paid Workers plan
- Self-hosted email — way too much overhead

## Lighthouse Score Hard to Measure Locally

**Constraint**: `next dev` server compiles on every request, making local Lighthouse scores misleading.

**Workaround**: Run Lighthouse against production URL (https://getkaru.io) via Chrome DevTools.

## DMARC Record Manual

**Constraint**: Cloudflare flags DMARC errors but doesn't auto-add the record.

**Workaround**: Manually add TXT record `_dmarc` in Cloudflare DNS. See [[30 - Deployment#DNS Records]].

## Mobile Animations Reduced

**Constraint**: Hero diagonal streaks and custom cursor disabled on mobile (would tank performance on low-end Android phones).

**Trade-off**: Mobile users see a slightly less animated hero. Worth it for sub-3s 3G load times.

## In-Memory Maintenance Mode

**Constraint**: `MAINTENANCE_MODE` env var is read at request time but Vercel needs a redeploy to update env vars.

**Workaround**: Toggle in Vercel dashboard, then trigger redeploy. Takes ~30 seconds.

**Alternative**: Could store in Supabase + cache for 30s, but added complexity not worth it.

## CSP Blocks Some Third-Party Tools

**Constraint**: Strict CSP requires whitelisting any external domain (Plausible, Resend, Cloudflare Turnstile, Leaflet's unpkg).

**Workaround**: Add domains to `next.config.mjs` CSP rules as needed. Each new tool requires a deploy.

## No `/api/account/delete` Yet

**Constraint**: Cameroon Law 2024/017 requires right-to-deletion endpoint by June 23, 2026.

**Roadmap**: Build `/api/account/delete` route. Currently users can email `hello@getkaru.io` to request deletion.

See [[40 - Roadmap]]

## No Mobile App Yet

**Constraint**: Current product is web-only.

**Roadmap**: PWA in Phase 2 (Q4 2026), native iOS/Android in Phase 3 (2027).

## No Native French Geo Mapping

**Constraint**: Vercel's geo headers return city names in English (e.g., "Paris" not "Paris, France").

**Workaround**: Display ISO country code instead. The map shows pins regardless.

## Gmail "From" Address Setup Friction

**Constraint**: To send as `hello@getkaru.io` from Gmail, you need to configure SMTP relay through Resend (separate from receiving).

**Workaround**: Currently send only via Resend API (transactional + admin broadcasts). Manual replies can be from any Gmail address.

## Plausible Costs Money

**Constraint**: $9/month after 30-day free trial.

**Alternative**: Vercel Speed Insights (free) covers Core Web Vitals. Plausible adds page-view + custom event tracking.

**Decision**: Keep Plausible — events like `waitlist_signup` are valuable.

## Database Region Locked

**Constraint**: Supabase project is locked to one region. Currently EU West (Ireland).

**Workaround**: Acceptable — Cameroon data is closer to EU than US. Cloudflare cache handles latency.

## Vendor Verification is Manual

**Constraint**: No automated document verification (RCCM, carte grise, etc.).

**Workaround**: Karu team reviews each vendor application manually. Won't scale beyond ~500 vendors.

**Roadmap**: AI-powered document verification in Phase 2.

See [[40 - Roadmap]]
