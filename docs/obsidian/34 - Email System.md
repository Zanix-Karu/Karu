---
tags: [karu, email, operations]
created: 2026-05-10
---

# Email System

## Overview

Two-way email system:
- **Sending**: Resend (transactional + broadcast)
- **Receiving**: Cloudflare Email Routing → Gmail

## Sending — Resend

### Setup
1. Domain `getkaru.io` verified in Resend
2. 3 DKIM CNAME records added to Cloudflare DNS
3. API key in `RESEND_API_KEY` env var

### From Address
- `Karu <noreply@getkaru.io>`

### Reply-To
Not set globally. Replies go to noreply (which is forwarded to Gmail via Email Routing).

### Free Tier
- 3,000 emails/month
- Sufficient for pre-launch waitlist

## Email Types

### 1. Waitlist Confirmation
Sent automatically when a user signs up.

- Component: `emails/WaitlistConfirmEmail.tsx`
- Bilingual (EN/FR based on user's locale)
- Customer vs Vendor variants
- Personalised by city
- Vendor: includes business name, "We'll reach out within 48 hours" message
- Vendor: also CC'd to `business_email` if provided

Subjects:
- EN customer: "You're on the list. Karu launches soon"
- EN vendor: "You're registered. Karu vendor early access"
- FR customer: "Vous êtes sur la liste. Karu arrive bientôt"
- FR vendor: "Inscription confirmée. Accès anticipé prestataire Karu"

### 2. Admin Single Email
Sent from admin panel `/admin/emails` → Compose tab → Single mode.

- One recipient
- Subject + HTML body wrapped in [[#Karu Template]]
- Logged to `admin_email_log`

### 3. Admin Broadcast
Sent from admin panel → Compose tab → Broadcast mode.

- Filtered by segment (type, city, locale)
- Up to 500 recipients per send
- Sent in batches of 50
- Logged with segment info

## Karu Template

`lib/email-template.ts` — wraps any HTML content in branded layout:

```
┌────────────────────────────┐
│       KARU (logo)           │  amber, letter-spaced
├────────────────────────────┤
│  ── amber divider ──        │
│                             │
│  Subject as heading         │  cream, bold
│                             │
│  [Your HTML body here]      │
│                             │
│  [ Visit getkaru.io ]       │  amber CTA button
│                             │
├────────────────────────────┤
│  © 2026 Karu                │  brown footer
│  Douala & Yaoundé, Cameroon │
│  Unsubscribe instructions   │
└────────────────────────────┘
```

Background: `#1C1208` (espresso) outer, `#231508` (surface) inner card.

## Email Log

All sent emails stored in `admin_email_log` table:
- Subject
- Recipient count
- Segment (for broadcasts)
- Resend message ID
- HTML body **encrypted** with AES (`html_encrypted`, `html_iv`)
- Timestamp
- Email type

Visible in admin panel `/admin/emails` with full body preview (decrypted on render).

See [[12 - Database Schema#admin_email_log]]

## Receiving — Cloudflare Email Routing

Free service that forwards emails to your Gmail.

### Configured Addresses

| Address | Forwards to |
|---------|-------------|
| hello@getkaru.io | your Gmail |
| support@getkaru.io | your Gmail |
| vendors@getkaru.io | your Gmail |
| noreply@getkaru.io | your Gmail |
| privacy@getkaru.io | your Gmail |

### Limitations
- One-way forwarding only (can't read inbox via API)
- Reading emails requires Gmail directly

### Future
Could implement Gmail API to view received emails in admin panel — but complex setup. See [[42 - Known Constraints]].

## Email Authentication

Three records required (all in Cloudflare DNS):

### SPF
Auto-configured by Cloudflare Email Routing.

### DKIM
3 CNAME records from Resend dashboard:
- resend._domainkey
- s1._domainkey
- s2._domainkey

(All proxy: OFF / grey cloud)

### DMARC
Manual TXT record:
```
Name: _dmarc
Content: v=DMARC1; p=quarantine; rua=mailto:hello@getkaru.io; pct=100
```

See [[30 - Deployment#DNS Records]]

## Testing

`scripts/test-emails.ts` — local script to test email rendering without sending.

## Common Tasks

### Send test email locally
```bash
ts-node scripts/test-emails.ts
```

### Check email log in production
Visit `/admin/emails` → All tab.

### Resend bounced email
Currently manual — copy from log, edit, resend via Compose.
