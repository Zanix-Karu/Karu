---
tags: [karu, security, operations]
created: 2026-05-10
---

# Security

> Comprehensive defence in depth. Security is non-negotiable.

## Cameroon Data Protection

**Law No. 2024/017** enacted December 23, 2024. 18-month grace period expires **June 23, 2026**. Karu must be compliant from launch.

### Required Implementations
- ✅ Consent at signup (bilingual privacy notice)
- ✅ Data minimisation (email + type + city only for customers)
- ✅ Encryption at rest (Supabase native + AES on email bodies)
- ✅ Encryption in transit (TLS 1.2+)
- ⏳ Right to deletion (`/api/account/delete` endpoint — TODO)
- ⏳ Breach notification process (incident log — TODO)
- ✅ Data residency (EU West Supabase region)
- ⏳ ROPA document — TODO

## Layers of Defence

### Layer 1: Cloudflare (network edge)
- DDoS protection
- WAF (Web Application Firewall)
- Bot Fight Mode
- AI Labyrinth (traps malicious AI scrapers)
- Cloudflare Turnstile (CAPTCHA on form submit)
- SSL/TLS Full (strict)
- HSTS preload

### Layer 2: HTTP Headers (Next.js)
Set in `next.config.mjs`:

| Header | Value |
|--------|-------|
| Strict-Transport-Security | max-age=63072000; includeSubDomains; preload |
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| Content-Security-Policy | strict whitelist |
| Permissions-Policy | camera=(), microphone=(), geolocation=() |
| Cross-Origin-Opener-Policy | same-origin |
| Cross-Origin-Resource-Policy | same-origin |
| Cross-Origin-Embedder-Policy | credentialless |
| X-Powered-By | (removed) |

### Layer 3: API Route Hardening
See [[13 - API Routes#POST /api/waitlist]]:

- Origin check (only getkaru.io and *.vercel.app)
- CSRF check (`X-Requested-With: XMLHttpRequest`)
- Content-Type enforcement (`application/json`)
- Payload size limit (5KB)
- Field whitelist (rejects unknown keys)
- Method blocking (only POST allowed)
- Turnstile token verification

### Layer 4: Input Validation
`lib/validations.ts`:

- Zod schema with strict types
- HTML tag stripping
- Dangerous character removal (`< > " ' ` ; \`)
- Phone field: digits + `+()-` only
- Vehicle count: strict enum
- Max lengths on all text fields

### Layer 5: Cryptography
`lib/crypto.ts`:

- IP hashing: HMAC-SHA256 with secret salt
- Falls back to salted SHA-256 if salt missing
- One-way operation, non-reversible
- Even with full DB compromise, IPs are protected

`lib/email-encrypt.ts`:
- AES encryption for stored email bodies
- Encryption key in env var

### Layer 6: Database
- Row Level Security on all tables
- Public can only INSERT into waitlist (no read/update/delete)
- service_role key never exposed to client

### Layer 7: Tech Stack Obfuscation
- `poweredByHeader: false` (no "Next.js" in headers)
- `productionBrowserSourceMaps: false` (no source code visible)
- `drop_console: true` (console.log stripped)
- `drop_debugger: true`
- React DevTools disabled in production via inline script
- Comments stripped from production JS

## The 20 Absolute Prohibitions

Hard rules. Never violate:

1. Never hardcode secrets, API keys, tokens
2. Never skip server-side validation
3. Never trust client-supplied data for security decisions
4. Never use string concatenation for SQL queries
5. Never store passwords in plaintext
6. Never log PII, tokens, payment details, passwords
7. Never expose stack traces to users
8. Never use sequential integer IDs for user-facing resources
9. Never disable HTTPS in any environment
10. Never commit `.env` files
11. Never use `eval()` with user input
12. Never trust webhook payloads without signature verification
13. Never process payments client-side
14. Never store mobile money PINs (when payments added)
15. Never allow unrestricted file uploads
16. Never reveal whether an email is registered (anti-enumeration)
17. Never implement custom cryptography
18. Never allow file path traversal
19. Never ship endpoints without auth (unless explicitly public)
20. Never expose `SUPABASE_SERVICE_ROLE_KEY` to client

## PII Handling

Never log:
- Email addresses (mask: `****@****.***`)
- Phone numbers (mask: `+237***XX45`)
- Names
- IP addresses (hashed only)
- Session tokens / JWT payloads

## Rate Limiting

Currently in-memory (doesn't work on Vercel serverless).

**Roadmap**: Move to Upstash Redis or Vercel KV when traffic grows.

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /api/waitlist | 3 | 1 hour |
| Future auth | 5 | 15 min |

## Email Authentication

- **SPF**: Configured via Cloudflare Email Routing
- **DKIM**: Resend provides 3 CNAME records
- **DMARC**: Manual TXT record `_dmarc` set in Cloudflare

## Anti-Enumeration

Never reveal if an email is already registered. The waitlist API returns success for duplicates (silently ignored at DB level via `onConflict: 'email', ignoreDuplicates: true`).

## Disclosure

Security contact at `/.well-known/security.txt`:
- Contact: mailto:hello@getkaru.io
- Expires: 2027-05-10
- Languages: en, fr

## Audit Trail

All admin emails logged to `admin_email_log` (encrypted bodies).

See [[12 - Database Schema#admin_email_log]]
