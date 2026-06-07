---
tags: [karu, roadmap, process]
created: 2026-05-10
---

# Roadmap

## Phase 0: Pre-Launch (NOW)

- ✅ Landing page live at getkaru.io
- ✅ Waitlist form (customer + vendor)
- ✅ Admin panel with analytics
- ✅ Cloudflare Turnstile CAPTCHA
- ✅ Bilingual EN/FR
- ✅ SEO + AI optimisation
- ✅ Security hardening
- ⏳ First 50 signups
- ⏳ Submit sitemap to Google Search Console
- ⏳ Create Google Business Profile

## Phase 1: Launch (target: Q3 2026)

### Vendor Onboarding
- Vendor dashboard (separate from admin)
- Document upload + verification flow
- RCCM, carte grise, insurance, visite technique
- Manual approval by Karu admin

### Listings
- Add/edit/remove vehicles
- Photo upload (WebP, optimised)
- Pricing in XAF
- Availability calendar

### Booking Flow
- Customer browses listings
- Filter by type, price, dates, pickup location
- Send booking request
- Vendor approves within 24h
- Pay via [[90 - Glossary#MTN MoMo|MTN MoMo]] or [[90 - Glossary#Orange Money|Orange Money]] (NotchPay integration)
- Confirmation email + WhatsApp link to vendor

### Payments
- NotchPay integration for mobile money
- Escrow holding (release after trip completes)
- Vendor payout dashboard

### Reviews
- Two-sided review system
- Customer rates vendor
- Vendor rates customer
- Both ratings public after both submit

## Phase 2: Validation (target: Q4 2026)

- Dynamic pricing
- Damage deposit workflow
- Insurance partnerships
- Driver add-on services
- Referral system
- Verified vendor badges
- Mobile app (PWA first, native later)

## Phase 3: Scale (target: 2027)

- GPS tracking integration
- Subscription rentals (monthly+)
- AI-powered recommendations
- Expansion to other Francophone African cities:
  - Yaoundé suburbs
  - Bafoussam
  - Garoua
  - Future: Libreville, Brazzaville, Abidjan

## Tech Debt to Address

- [ ] Move rate limiting to Upstash Redis
- [ ] Add automated tests (E2E with Playwright)
- [ ] Set up CI/CD with status checks
- [ ] Add monitoring (Sentry or similar)
- [ ] Implement `/api/account/delete` for GDPR/Law 2024/017 compliance
- [ ] Create ROPA document
- [ ] Incident response playbook

## Marketing Tasks

- [ ] Write 10 blog posts targeting long-tail keywords
- [ ] Outreach to Cameroon diaspora forums
- [ ] Partner with travel blogs covering West Africa
- [ ] Instagram campaign with city imagery
- [ ] WhatsApp Business listing
- [ ] Reach out to NGO partners

## Open Questions

- Customer service: phone, chat, or email-only at launch?
- Damage handling: who pays first, vendor or platform?
- Insurance: partner with one provider or aggregate multiple?
- Currency: XAF only, or display in EUR/USD for diaspora?

See [[43 - Launch Checklist]]
