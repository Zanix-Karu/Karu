---
inclusion: always
---

# Karu — Domains & Email

## Domain Map

| Domain | Purpose | Hosting |
|---|---|---|
| `getkaru.io` | Marketing landing page + waitlist | Vercel |
| `app.getkaru.io` | Customer web app | Vercel |
| `vendor.getkaru.io` | Vendor dashboard portal | Vercel |
| `getkaru.io/blog` | Blog content (SEO subfolder) | Vercel |
| `getkaru.io/help` | Help centre (SEO subfolder) | Vercel |
| `getkaru.io/douala` | Douala city landing page | Vercel |
| `getkaru.io/yaounde` | Yaoundé city landing page | Vercel |
| `zanix.co` | Corporate / tech company site | Vercel |
| `api.zanix.co` | Backend API gateway | Supabase |
| `admin.zanix.co` | Internal admin dashboard | Vercel |
| `status.zanix.co` | Uptime status page | Vercel |
| `docs.zanix.co` | API documentation | Vercel |
| `staging.getkaru.io` | Staging environment | Vercel (preview) |
| `staging.zanix.co` | Admin staging | Vercel (preview) |

## Critical Rules
- Blog and help MUST be subfolders (`getkaru.io/blog`) NEVER subdomains (`blog.getkaru.io`)
- Staging environments MUST have `<meta name="robots" content="noindex, nofollow">`
- All HTTP redirects to HTTPS (enforced by Cloudflare)
- `www.getkaru.io` redirects to `getkaru.io` (apex)

## DNS Infrastructure
- Registrar: Namecheap (domain registration only)
- DNS management: Cloudflare (free plan)
- CDN + SSL: Cloudflare (automatic, free)
- Hosting: Vercel (connected to Cloudflare via A record + CNAME)

## Cloudflare DNS Records
```
Type    Name      Value                    Proxy
A       @         76.76.21.21              ON
CNAME   www       cname.vercel-dns.com     ON
CNAME   app       cname.vercel-dns.com     ON
CNAME   vendor    cname.vercel-dns.com     ON
```

---

## Email Addresses

| Address | Purpose |
|---|---|
| `hello@getkaru.io` | General enquiries, primary customer contact |
| `support@getkaru.io` | Customer support and issue resolution |
| `vendors@getkaru.io` | Vendor onboarding and vendor support |
| `admin@getkaru.io` | Internal operations |
| `legal@getkaru.io` | Legal, compliance, regulatory |
| `privacy@getkaru.io` | Data Protection Officer contact (Law 2024/017) |
| `press@getkaru.io` | Media and press enquiries |
| `noreply@getkaru.io` | Transactional email sender (booking confirmations, OTPs) |

## Email Infrastructure

### Receiving (Cloudflare Email Routing — free)
All `@getkaru.io` addresses forward to the team Gmail via Cloudflare Email Routing.
Cloudflare automatically adds MX and TXT records when enabled.
Up to 200 routing rules supported on free plan.

### Sending Transactional (Resend — free tier)
- Provider: Resend (resend.com)
- Free tier: 3,000 emails/month
- From: `Karu <noreply@getkaru.io>`
- Reply-to: `support@getkaru.io`
- DKIM records added to Cloudflare DNS via Resend dashboard

### Sending as Custom Address from Gmail
After Resend DKIM setup:
Gmail → Settings → Accounts → Send mail as → Add `hello@getkaru.io`
SMTP: `smtp.resend.com`, port `465`, user `resend`, password = Resend API key

## Email in Code — Always Use Environment Variables

```env
# Email configuration
EMAIL_FROM=noreply@getkaru.io
EMAIL_REPLY_TO=support@getkaru.io
EMAIL_SUPPORT=support@getkaru.io
EMAIL_VENDORS=vendors@getkaru.io
EMAIL_LEGAL=legal@getkaru.io
EMAIL_PRIVACY=privacy@getkaru.io
RESEND_API_KEY=[resend-api-key]
```

NEVER hardcode `@getkaru.io` addresses directly in source code.
NEVER hardcode personal Gmail addresses anywhere in the codebase.
Always reference via environment variables.

## Transactional Email Templates

All transactional emails must be:
- Bilingual: French content first, English below (Cameroon context)
- From: `Karu <noreply@getkaru.io>`
- Reply-to: `support@getkaru.io`
- Include unsubscribe link for marketing emails

Key transactional emails to implement:
```
booking_request_received     → customer confirmation of booking request sent
booking_approved             → customer notified vendor approved
payment_confirmed            → both parties notified of confirmed booking
booking_reminder             → 24h before pickup
booking_complete             → trip ended, review prompt
vendor_new_booking           → vendor notified of new booking request
vendor_payout_processed      → vendor notified of payout
otp_verification             → phone number OTP (via Africa's Talking SMS)
waitlist_confirmation        → pre-launch waitlist signup confirmation
```
