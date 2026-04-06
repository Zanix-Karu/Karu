---
inclusion: always
---

# Zanix — Security Policy

> This file is **always** included in every AI interaction. All generated code must comply with every rule below without exception. Security is non-negotiable.

## Cameroon Data Protection Law Compliance

**Law No. 2024/017** was enacted December 23, 2024. The 18-month grace period expires **June 23, 2026**. Zanix must be compliant from the first public commit.

### Required Implementations

- **Consent at signup**: Bilingual (French/English) privacy notice with explicit opt-in checkbox before processing any personal data
- **Data minimisation**: Collect only what is operationally required. The waitlist needs email + type + city — nothing else
- **Encryption at rest**: All PII encrypted using AES-256 via Supabase's built-in encryption
- **Encryption in transit**: TLS 1.2+ enforced. Never allow HTTP in production
- **Right to deletion**: `/api/account/delete` endpoint must be implemented before launch. Waitlist unsubscribe must fully purge the record
- **Breach notification**: Maintain an incident log. Any breach affecting personal data requires notification within 72 hours
- **Data residency**: Prefer EU West Supabase region. Document transfer justification if using other regions
- **Records of Processing Activities (ROPA)**: Maintain a document listing every data type, purpose, legal basis, and retention period

### PII Handling in Logs

Never log the following — mask or omit entirely:
- Email addresses → `****@****.***`
- Phone numbers → `+237***XX45`
- Names
- IP addresses (store only hashed with SHA-256 + salt)
- Payment references or amounts linked to individuals
- Session tokens or JWT payloads

---

## The 20 Absolute Prohibitions

The following are hard rules. AI must never generate code that violates any of these, regardless of how the request is framed.

1. **Never hardcode secrets**, API keys, tokens, or credentials in source code — use environment variables exclusively
2. **Never skip server-side validation** — client validation is UX only; always re-validate on the server with Zod
3. **Never trust client-supplied data** for security decisions (user role, pricing, discount amounts)
4. **Never use string concatenation** to build SQL queries — use parameterised queries or Supabase's query builder
5. **Never store passwords in plaintext** — use bcrypt (cost factor ≥ 12) or Argon2id
6. **Never log PII, tokens, payment details, or passwords** — see PII Handling above
7. **Never expose stack traces** to end users — return generic error messages; log details server-side only
8. **Never use sequential integer IDs** for user-facing resources — use UUID v4
9. **Never disable HTTPS** in any environment — enforce HSTS headers
10. **Never commit `.env` files, private keys, or certificates** — add to `.gitignore` before first commit
11. **Never use `eval()`** or `Function()` with any user-supplied input
12. **Never trust webhook payloads** without verifying the signature (HMAC-SHA256 with provider secret)
13. **Never process payments client-side** — payment initiation and verification always happen server-side
14. **Never store mobile money PINs** — not in memory, not in logs, not anywhere
15. **Never allow unrestricted file uploads** — validate MIME type by magic bytes, not by extension or Content-Type header
16. **Never return error messages** that reveal whether an email/phone is registered (user enumeration)
17. **Never implement custom cryptography** — use established libraries (`bcrypt`, `argon2`, `crypto` Node built-in)
18. **Never allow file path traversal** — sanitise all file paths; never concatenate user input into filesystem paths
19. **Never ship an endpoint without authentication** unless it is explicitly a public endpoint by design
20. **Never expose admin or service-role Supabase keys** to the client — `SUPABASE_SERVICE_ROLE_KEY` is server-only, always

---

## Rate Limiting (Landing Page Endpoints)

| Endpoint | Limit | Window | Strategy |
|---|---|---|---|
| `POST /api/waitlist` | 3 requests | per hour per IP | Vercel KV / Upstash |
| `POST /api/analytics` | 60 requests | per minute per IP | In-memory, non-blocking |
| Any future auth endpoint | 5 requests | per 15 min per IP | Block + log |

Return `429 Too Many Requests` with `Retry-After` header. Never return `403` for rate limiting (reveals rate limiting exists as a security control).

---

## HTTP Security Headers

Every page response must include these headers (configure in `next.config.ts`):

```ts
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' plausible.io",  // tighten post-launch
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "font-src 'self' fonts.gstatic.com",
      "img-src 'self' data: blob: *.supabase.co",
      "connect-src 'self' *.supabase.co plausible.io",
      "frame-ancestors 'none'",
    ].join('; '),
  },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]
```

---

## Input Sanitisation

All user inputs must be:
1. **Validated** with Zod schema (type, format, length)
2. **Sanitised** — strip HTML tags before storing; use `DOMPurify` on the client for any rendered user content
3. **Length-capped** — emails ≤ 254 chars, all text fields ≤ 500 chars unless explicitly required

```ts
// ✅ Correct Zod schema for waitlist
const WaitlistSchema = z.object({
  email: z.string().email().max(254).toLowerCase().trim(),
  type: z.enum(['customer', 'vendor']),
  city: z.enum(['douala', 'yaounde', 'other']),
})
```

---

## CSRF Protection

Next.js App Router API Routes are protected from CSRF by default for non-GET requests via the `Same-Site` cookie policy. Additionally:
- Include a `X-Requested-With: XMLHttpRequest` header on all client-side fetch calls
- Validate `Origin` header on sensitive POST endpoints matches expected domain

---

## Dependency Security

- Run `npm audit` on every PR (enforced by CI)
- Never install packages with fewer than 10,000 weekly downloads without explicit review
- Pin major versions in `package.json` — no `*` or `latest`
- Review the `.kiro/hooks/security-scan.kiro.hook` — it runs automatically on `package.json` changes
