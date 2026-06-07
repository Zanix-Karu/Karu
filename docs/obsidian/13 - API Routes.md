---
tags: [karu, engineering, api]
created: 2026-05-10
---

# API Routes

## Public Routes

### `POST /api/waitlist`

Adds an email to the waitlist and sends a confirmation email.

**Request**:
```json
{
  "email": "user@example.com",
  "type": "vendor",
  "city": "douala",
  "locale": "en",
  "business_name": "JP Auto",
  "business_email": "info@jpauto.cm",
  "phone": "+237655123456",
  "vehicle_count": "1-5",
  "turnstile_token": "..."
}
```

**Validations** (all server-side):
1. Origin check — must be from getkaru.io or *.vercel.app
2. CSRF — `X-Requested-With: XMLHttpRequest` header required
3. Content-Type — must be `application/json`
4. Payload size — max 5KB
5. Field whitelist — only known keys allowed
6. Turnstile token verification (if configured)
7. Zod validation + sanitisation

**Response**: `201 Created`
```json
{
  "success": true,
  "data": { "message": "You're on the list!" }
}
```

**Side effects**:
- Insert into [[12 - Database Schema#waitlist_entries|waitlist_entries]]
- Send Karu-branded confirmation email
- Track Plausible event (no PII)

**Other methods** (GET, PUT, DELETE, PATCH): Return `405 Method Not Allowed`.

### `GET /api/waitlist/count`

Returns total signup count.

**Response**: `200 OK`
```json
{
  "success": true,
  "data": { "count": 42 }
}
```

**Caching**: `public, max-age=60, stale-while-revalidate=300`

Used by:
- Hero social proof counter
- Waitlist form footer

## Admin Routes (JWT-protected)

All require `karu_admin` cookie set by login route.

### `POST /api/admin/login`

```json
{ "username": "admin", "password": "..." }
```

Returns `200` with `Set-Cookie` on success.

### `POST /api/admin/logout`

Clears the cookie.

### `GET /api/admin/data`

Returns waitlist entries with lead scoring. Query params:
- `type` — vendor / customer / all
- `city` — douala / yaounde / other / all
- `tier` — HOT / WARM / COLD / all
- `locale` — en / fr / all
- `q` — search by email or business name

### `GET /api/admin/emails`

Returns email log entries (decrypted bodies).

### `POST /api/admin/send`

Send single email or broadcast.

**Single**:
```json
{
  "mode": "single",
  "to": "user@example.com",
  "subject": "Update from Karu",
  "html": "<p>Your message here</p>"
}
```

**Broadcast**:
```json
{
  "mode": "broadcast",
  "subject": "Karu launches in Douala",
  "html": "<p>We are live!</p>",
  "segment": { "type": "vendor", "city": "douala", "locale": "all" }
}
```

Wraps content in [[34 - Email System#Karu Template|Karu template]].
Logs to `admin_email_log` (encrypted).

## Security Headers

All API routes return:
- `Cache-Control: no-store, no-cache, must-revalidate`
- `X-Content-Type-Options: nosniff`
- No source maps
- No tech stack hints

See [[32 - Security]]

## Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| `INVALID_JSON` | 400 | Body not valid JSON |
| `INVALID_CONTENT_TYPE` | 400 | Wrong content-type |
| `VALIDATION_ERROR` | 400 | Zod failed or unknown field |
| `PAYLOAD_TOO_LARGE` | 413 | Body > 5KB |
| `FORBIDDEN` | 403 | Origin/CSRF check failed |
| `CAPTCHA_REQUIRED` | 403 | Turnstile token missing |
| `CAPTCHA_FAILED` | 403 | Turnstile verification failed |
| `METHOD_NOT_ALLOWED` | 405 | Wrong HTTP method |
| `INTERNAL_ERROR` | 500 | Generic server error (no stack trace exposed) |
