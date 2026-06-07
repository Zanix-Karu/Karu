---
tags: [karu, operations, security, deployment]
created: 2026-05-10
---

# Environment Variables

> All secrets are set in Vercel → Settings → Environment Variables. Local dev uses `.env`.
> 
> **Never** commit `.env` to git.

## Required for Production

### Supabase
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```
- `NEXT_PUBLIC_*` are safe to expose to client
- `SUPABASE_SERVICE_ROLE_KEY` is **server only** (bypasses RLS)

### Resend
```bash
RESEND_API_KEY=re_xxxxxxxx
```
Used for sending all transactional and broadcast emails.

### Security
```bash
IP_HASH_SALT=64-char-hex-string         # generate: openssl rand -hex 32
EMAIL_LOG_ENCRYPTION_KEY=base64-32-bytes # generate: openssl rand -base64 32
ADMIN_JWT_SECRET=at-least-32-chars       # any random string
```

### Admin Auth
```bash
ADMIN_USERNAME=your-username
ADMIN_PASSWORD_HASH=bcrypt-hash          # generate via Node: bcrypt.hashSync('password', 12)
```

### Cloudflare Turnstile (CAPTCHA)
```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA...
TURNSTILE_SECRET_KEY=0x4AAAAAAA...
```
Get from Cloudflare → Turnstile → Add Widget. If not set, CAPTCHA is skipped (graceful fallback).

## Optional

### Analytics
```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=getkaru.io
```
If unset, Plausible script doesn't load.

### Google Search Console
```bash
GOOGLE_SITE_VERIFICATION=token
```
Adds `<meta>` verification tag.

### Maintenance Mode
```bash
MAINTENANCE_MODE=true
```
Set to `true` to redirect all traffic to `/maintenance` page.

## Where Each Variable is Used

| Variable | File | Purpose |
|----------|------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase-admin.ts` | Connect to Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase-admin.ts` | Bypass RLS for inserts |
| `RESEND_API_KEY` | `app/api/waitlist/route.ts`, `app/api/admin/send/route.ts` | Send emails |
| `IP_HASH_SALT` | `lib/crypto.ts` | HMAC-SHA256 IP hashing |
| `EMAIL_LOG_ENCRYPTION_KEY` | `lib/email-encrypt.ts` | AES encrypt email bodies |
| `ADMIN_JWT_SECRET` | `lib/admin-auth.ts`, `middleware.ts` | Sign and verify JWT |
| `ADMIN_USERNAME` | `app/api/admin/login/route.ts` | Login validation |
| `ADMIN_PASSWORD_HASH` | `app/api/admin/login/route.ts` | Login validation |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `components/landing/WaitlistSection.tsx` | Render CAPTCHA |
| `TURNSTILE_SECRET_KEY` | `app/api/waitlist/route.ts` | Verify CAPTCHA |
| `MAINTENANCE_MODE` | `middleware.ts` | Toggle maintenance page |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `app/[locale]/layout.tsx` | Load analytics |

## How to Generate Secure Values

```bash
# 64-character hex (for salts)
openssl rand -hex 32

# Base64 (for AES keys)
openssl rand -base64 32

# bcrypt hash (for passwords)
node -e "console.log(require('bcrypt').hashSync('your-password', 12))"
```

## Local Development

Create `.env` (gitignored) with the same keys. Use Supabase staging project, Resend test domain, etc.

## Vercel CLI

```bash
# Pull production env to local
vercel env pull .env.production.local

# Add a new var
vercel env add KEY_NAME production
```

See [[32 - Security]] for security model.
