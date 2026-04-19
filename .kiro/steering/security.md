---
inclusion: always
---

# Karu — Security & Compliance

## Data Protection — Law No. 2024/017

Cameroon enacted Law No. 2024/017 on 23 December 2024 — a comprehensive GDPR-aligned
data protection law. **Compliance deadline: 23 June 2026.** Karu must comply from launch.

### Key Obligations
- Consent-based data processing (opt-in, not opt-out)
- Data subject rights: access, rectification, deletion, portability
- Mandatory breach notification
- Data minimisation — collect only what is necessary
- Encryption at rest (AES-256) and in transit (TLS 1.2+)
- Records of Processing Activities (ROPA) maintained
- Data Protection Officer (DPO) appointed — contact: `privacy@getkaru.io`
- Cross-border data transfers require regulatory approval
- Bilingual privacy notice (French + English) at registration

### For Karu Specifically
- Mask phone numbers and names in logs: `+237***XX45`
- Build data export and account deletion endpoints before launch
- Consider hosting within Africa (HOSTAFRICA South Africa) for data residency
- Any transfer outside Cameroon (e.g. Supabase Frankfurt) needs documented basis

---

## Authentication

### Phone + OTP (Primary Method)
- 6-digit numeric codes only
- Expire in 60–120 seconds
- Single-use — invalidated after first verification attempt
- Maximum 3 verification attempts per OTP
- NEVER stored in plain text — store bcrypt/argon2 hashed
- Rate limit: 3 OTP requests per phone number per 10 minutes
- Generic error messages only: "Invalid or expired code" — never reveal if number is registered

### JWT Tokens
- Access tokens: RS256 signing, 15-minute expiration
- Refresh tokens: 7–30 day lifetime
- Store refresh tokens in Android Keystore / iOS Keychain only
- Strict rotation: issue new refresh token on each use, invalidate old one
- Maintain blocklist of revoked token IDs

---

## Authorisation (RBAC)

### Roles
| Role | Permissions |
|---|---|
| `CUSTOMER` | Browse listings, create bookings, write reviews |
| `VENDOR` | Manage own vehicles, listings, and bookings |
| `ADMIN` | Manage all users, listings, resolve disputes |
| `SUPER_ADMIN` | Manage admins, access audit logs |

### Rules
- Every API endpoint enforces BOTH role verification AND resource ownership
- Vendors can only edit their own vehicles: `listing.vendorId === currentUser.id`
- Use UUIDs for all user-facing resource IDs — NEVER sequential integers
- Supabase RLS policies enforce data isolation at database level

---

## Rate Limiting

| Endpoint | Limit | Window |
|---|---|---|
| Login / OTP request | 5 requests | per 15 min per IP |
| OTP verification | 3 attempts | per OTP code |
| Registration | 3 requests | per hour per IP |
| Listing creation | 10 | per hour per user |
| Search / browse | 60 | per minute per user |
| Payment initiation | 5 | per minute per user |
| File upload | 20 | per hour per user |
| General API | 100 | per minute per user |

Rate limit by authenticated user ID when available, IP as fallback.
NEVER rate limit solely by IP — NAT gateways in African networks share IPs across many users.
Return `X-RateLimit-*` headers and `429` with `Retry-After` on limit exceeded.

---

## The 20 Absolute Prohibitions

The AI agent MUST NEVER do any of the following under any circumstances:

1. Hardcode secrets, API keys, or tokens in source code
2. Skip server-side validation even if client validation exists
3. Trust client-side data for security decisions
4. Use string concatenation for SQL queries — always parameterised
5. Store passwords in plain text — always bcrypt/argon2
6. Log PII, passwords, tokens, or payment details
7. Expose stack traces to end users
8. Use sequential / predictable IDs for user-facing resources
9. Disable HTTPS in production
10. Commit `.env` files, private keys, or certificates to git
11. Use `eval()` with user input
12. Trust webhook data without signature verification
13. Process payments client-side
14. Store mobile money PINs
15. Allow unrestricted file uploads — validate by magic bytes, not extension
16. Return error messages that reveal system state (user enumeration)
17. Implement custom cryptography
18. Allow file path traversal in uploads
19. Skip authentication on any endpoint
20. Expose admin endpoints without role checks

---

## File Upload Security

Allowed MIME types: `image/jpeg`, `image/png`, `image/webp` only
Validation: magic bytes — NOT Content-Type header or file extension
Max file size: 10MB per file
Max files per listing: 10
All uploaded files renamed to UUIDs (strip original filename)
Strip EXIF metadata (may contain GPS and device info)
Store in Supabase Storage with private ACLs, serve via CDN with signed URLs
Queue async malware scan — mark as "pending scan" until cleared

---

## Mobile Money Payment Security

- All payment API calls over HTTPS only
- Implement idempotency keys on every payment request
- Validate webhook/callback signatures and source IPs from NotchPay
- Design for timeout/pending states (MTN MoMo confirmation: 10–30 seconds)
- Implement transaction status polling as fallback to webhooks
- Set transaction velocity limits, flag unusual patterns
- Escrow model: customer funds held by platform, released after trip completion

---

## Sensitive Data Handling

### Phone Numbers
- Primary identifier for users in Cameroon
- Store hashed for lookup, masked in logs: `+237***XX45`
- Never expose in API responses beyond last 4 digits

### Identity Documents (vendor onboarding)
- RCCM certificate, carte grise, insurance certificate stored in Supabase Storage
- Private ACL — accessible only to vendor owner and admin
- Never returned in public API responses

### Payment Data
- NotchPay handles PCI compliance — never store card numbers
- Store only: transaction reference, amount, status, timestamp
- Mobile money phone numbers stored encrypted at rest

---

## Vercel Deployment Security Headers

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" }
      ]
    }
  ]
}
```

---

## Regulatory Compliance Checklist

| Regulator | Requirement | Status |
|---|---|---|
| ANTIC | Cybersecurity compliance certificate | Required pre-launch |
| ART | Telecom certification (mandatory since April 2025) | Required pre-launch |
| MINPOSTEL/NECAP | National digital platform registration | Required pre-launch |
| MINTRANS S10 | Digital transport platform licence | Required pre-launch |
| CIMA Code | Motor third-party liability insurance for all listed vehicles | Required pre-launch |
| Law No. 2024/017 | Data protection compliance | Deadline: 23 June 2026 |
