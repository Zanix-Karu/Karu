---
tags: [karu, launch, process]
created: 2026-05-10
---

# Launch Checklist

> Pre-launch and launch-day tasks. Tick off as completed.

## Infrastructure

- [x] Vercel deployment connected
- [x] Cloudflare DNS configured
- [x] Cloudflare proxied (orange cloud)
- [x] SSL/TLS Full (strict)
- [x] HSTS enabled
- [x] Bot Fight Mode ON
- [x] AI Labyrinth ON
- [x] DMARC record set
- [x] DKIM verified in Resend
- [x] Email Routing rules added
- [x] security.txt published
- [ ] Cloudflare Turnstile configured + env vars set
- [ ] All env vars set in Vercel production

## Database

- [x] Supabase project created (EU West)
- [x] `waitlist_entries` table with full schema
- [x] `admin_email_log` table with encryption columns
- [x] RLS policies enabled
- [x] `service_role_all` policy added
- [x] Indexes created
- [ ] Test data deleted before launch

## Code

- [x] Production build passes
- [x] No `console.log` in production (auto-stripped)
- [x] Source maps disabled in production
- [x] React DevTools disabled in production
- [x] All translations complete EN + FR

## Security

- [x] HMAC-SHA256 IP hashing active
- [x] AES email encryption active
- [x] All API routes have origin + CSRF checks
- [x] Method blocking on API routes (only POST)
- [x] Payload size limits (5KB)
- [x] Field whitelisting on body
- [x] X-Powered-By stripped
- [ ] Turnstile verifying tokens server-side (when env vars set)
- [ ] Penetration test (Phase 1)

## SEO

- [x] Sitemap.xml generated
- [x] robots.txt allowing all good bots
- [x] llms.txt and llms-full.txt published
- [x] JSON-LD structured data (3 schemas)
- [x] Meta tags optimised for keywords
- [x] hreflang tags for EN + FR
- [x] OG image dynamic
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Create Google Business Profile

## Performance

- [x] Fonts use display: swap
- [x] No images on landing page (CSS/SVG only)
- [x] Plausible loads lazily
- [x] Mobile optimisations (hidden cursor, simplified animations)
- [x] 3G optimisation (`prefers-reduced-data` support)
- [x] Touch targets ≥ 44px
- [x] Vercel Speed Insights tracking
- [ ] Lighthouse score ≥ 90 on production URL

## Legal / Compliance

- [x] Privacy policy page (EN + FR)
- [x] Terms of service page (EN + FR)
- [x] Contact page with email
- [x] Cookie-free analytics (Plausible)
- [ ] `/api/account/delete` endpoint (Phase 1)
- [ ] ROPA document
- [ ] Incident response playbook

## Testing

- [x] Build passes locally
- [x] Form submission works (customer)
- [x] Form submission works (vendor with all fields)
- [x] Confirmation emails delivered
- [x] Admin login works
- [x] Admin can view waitlist
- [x] Admin can send single email
- [x] Admin can send broadcast
- [x] Map shows pins
- [x] Maintenance mode toggles correctly
- [ ] Mobile test on real devices (iPhone, Android)
- [ ] 3G throttling test (Chrome DevTools)

## Marketing

- [ ] Social media handles secured (Instagram @getkaru.io done)
- [ ] First marketing campaign drafted
- [ ] Press release / launch post written
- [ ] Outreach list compiled
  - [ ] Diaspora forums
  - [ ] Travel blogs
  - [ ] Cameroon business directories
- [ ] Founder LinkedIn posts ready

## Reset Database (if needed)

```sql
DROP TABLE IF EXISTS admin_email_log;
DROP TABLE IF EXISTS waitlist_entries;
```

Then recreate using full schema in [[12 - Database Schema]].

## Day-of-Launch

- [ ] Toggle off `MAINTENANCE_MODE`
- [ ] Verify all env vars in Vercel
- [ ] Manual smoke test on getkaru.io
- [ ] Submit a test waitlist signup
- [ ] Verify email arrives
- [ ] Check Vercel logs for any errors
- [ ] Post on Instagram + LinkedIn
- [ ] Send launch email to existing waitlist
- [ ] Monitor Plausible for traffic spikes

## Post-Launch (Week 1)

- [ ] Daily check of Vercel logs for errors
- [ ] Review waitlist signups in admin panel
- [ ] Reach out personally to vendor signups
- [ ] Track conversion: visitor → signup
- [ ] Optimise based on data

See [[40 - Roadmap]] for what comes after.
