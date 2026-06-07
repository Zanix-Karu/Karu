---
tags: [karu, bugfix, process]
created: 2026-05-10
---

# Recently Fixed

> Log of resolved issues in the order they were fixed.

## 2026-05-10

### Turnstile CSP block
**Issue**: Cloudflare Turnstile script blocked by Content-Security-Policy.
**Fix**: Added `challenges.cloudflare.com` to `script-src`, `connect-src`, `frame-src`.
**Commit**: `ba6ad3e`

### Cloudflare config issues
**Issue**: Cloudflare flagged 6 issues (DMARC, security.txt, Bot Fight Mode, AI Labyrinth).
**Fix**: Added `/.well-known/security.txt`, configured DMARC record, enabled Bot Fight Mode and AI Labyrinth in dashboard.
**Commit**: `0167603`

### Map missing coordinates
**Issue**: Admin map didn't show pins because `lat` and `lng` columns didn't exist in DB.
**Fix**: Added migration for geo columns, restored geo header capture in API.
**Commit**: `158ae04`

### Phone number not showing in admin
**Issue**: Admin waitlist table only showed a green checkmark for phone, not the actual number.
**Fix**: Display full phone string instead of icon.
**Commit**: `e1571ae`

### Vercel preview CSRF block
**Issue**: API rejected requests from `*.vercel.app` preview deployments (403).
**Fix**: Added `.vercel.app` wildcard to allowed origins.
**Commit**: `b3a8ad6`

### API 500 — non-existent columns
**Issue**: API tried to insert `region`, `lat`, `lng` columns that didn't exist in table.
**Fix**: Removed columns from insert, then later added migration for them.
**Commit**: `43d6469`

### API 404 — middleware wrapping API routes in locale
**Issue**: Middleware was sending `/api/waitlist` through `next-intl`, rewriting to `/en/api/waitlist` (404).
**Fix**: Bypass i18n entirely for `/api/*` routes.
**Commit**: `3f3e0df`

## 2026-05-09

### Yellow streak flash on load
**Issue**: 4 amber diagonal streaks were briefly visible during page load before animation kicked in.
**Fix**: Added `opacity-0` Tailwind class directly to elements (renders inline before CSS loads).
**Commit**: `a4358ac`

### Vendor fields not appearing
**Issue**: Selecting "Vendor" didn't show business name, phone, vehicle count fields.
**Fix**: Rewrote form with controlled state instead of react-hook-form. Multi-step flow (type → details).
**Commit**: `96f2814`

### Leaflet CSS blocked by CSP
**Issue**: Map CSS from `unpkg.com` blocked by CSP.
**Fix**: Added `unpkg.com` and `*.basemaps.cartocdn.com` to CSP.
**Commit**: `f7581b5`

### Form submission "I am a" duplicate label
**Issue**: Form had "I am a" label above the customer/vendor buttons (redundant).
**Fix**: Removed the label since buttons already say "I'm a Customer" / "I'm a Vendor".
**Commit**: `40d541c`

## Older

### Whitespace from removed sections
**Issue**: Stats row was removed but space remained.
**Fix**: Removed StatsRow import and render from page.

### "Zanix" → "Karu" rebrand
**Issue**: Whole codebase still referenced "Zanix" everywhere.
**Fix**: Comprehensive rebrand across components, translations, emails, configs.

### WhatsApp removed from features
**Issue**: WhatsApp Integration card no longer aligned with strategy.
**Fix**: Replaced with In-App Chat feature.

## Process Notes

When fixing bugs:
1. Reproduce locally first
2. Check Vercel runtime logs if production-only
3. Fix + add to this doc + commit with `fix:` prefix
4. Verify on production after deploy

See [[42 - Known Constraints]] for unresolved issues.
