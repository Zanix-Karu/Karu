---
inclusion: fileMatch
fileMatchPattern: ["app/api/**/*", "lib/supabase*.ts", "lib/validations.ts"]
---

# Zanix — API Standards

## REST Conventions

All API Routes follow RESTful conventions and return consistent JSON shapes.

### URL Structure

```
POST   /api/waitlist              — Join the waitlist
GET    /api/waitlist/count        — Public: total signup count (no PII)
POST   /api/analytics/event       — Track a page event
POST   /api/contact               — Contact form submission
```

### Response Envelope

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message (safe to surface to users)",
    "fields": [
      { "field": "email", "message": "Invalid email address" }
    ]
  }
}
```

### HTTP Status Codes

| Code | When to use |
|---|---|
| `200` | GET success |
| `201` | POST success (resource created) |
| `400` | Validation error (malformed input) |
| `401` | Missing or invalid authentication |
| `403` | Authenticated but unauthorised |
| `404` | Resource not found |
| `409` | Conflict (e.g. email already on waitlist) |
| `429` | Rate limit exceeded |
| `500` | Unexpected server error (never expose details) |

Never return `200` for an error. Never return `500` for a validation error.

---

## API Route Template

Every API route must follow this exact structure:

```ts
// app/api/[endpoint]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

// Schema defined at module level — not inside handler
const RequestSchema = z.object({
  // ... fields
})

export async function POST(request: NextRequest) {
  // 1. Rate limit check
  const rateLimitResult = await rateLimit(request, { limit: 3, window: '1h' })
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
      {
        status: 429,
        headers: { 'Retry-After': rateLimitResult.retryAfter.toString() },
      }
    )
  }

  // 2. Parse and validate
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' } },
      { status: 400 }
    )
  }

  const result = RequestSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          fields: result.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })),
        },
      },
      { status: 400 }
    )
  }

  // 3. Business logic
  try {
    // ... database operations, email sends, etc.
    return NextResponse.json({ success: true, data: { ... } }, { status: 201 })
  } catch (error) {
    // Log privately, return generic message
    console.error('[API /endpoint] Unexpected error:', error instanceof Error ? error.message : 'unknown')
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    )
  }
}
```

---

## Waitlist API — Specification

### `POST /api/waitlist`

Adds an email to the pre-launch waitlist and sends a confirmation email.

**Request:**
```json
{
  "email": "user@example.com",
  "type": "customer",
  "city": "douala"
}
```

**Validation rules:**
- `email`: valid RFC 5321 email, max 254 chars, lowercased and trimmed
- `type`: one of `["customer", "vendor"]`
- `city`: one of `["douala", "yaounde", "other"]`

**On success (201):**
- Insert into `waitlist_entries` (upsert on email conflict — do not error on duplicate, silently succeed)
- Send confirmation email via Resend
- Track `waitlist_signup` event in Plausible
- Return `{ success: true, data: { message: "You're on the list!" } }`

**On duplicate (200, not 409):** Return success silently — do not reveal whether an email was already registered.

**Supabase table:**
```sql
CREATE TABLE waitlist_entries (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('customer', 'vendor')),
  city        TEXT NOT NULL CHECK (city IN ('douala', 'yaounde', 'other')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  ip_hash     TEXT,  -- SHA-256 hash of IP, for dedup only
  UNIQUE(email)
);

ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;
-- Public insert only; no public read
CREATE POLICY "Allow public insert" ON waitlist_entries FOR INSERT WITH CHECK (true);
```

---

### `GET /api/waitlist/count`

Returns the total number of signups (no PII). Public endpoint, cached for 60 seconds.

**Response:**
```json
{
  "success": true,
  "data": { "count": 847 }
}
```

Add `Cache-Control: public, max-age=60, stale-while-revalidate=300` header.

---

## Error Code Reference

| Code | Meaning |
|---|---|
| `VALIDATION_ERROR` | Zod schema validation failed |
| `INVALID_JSON` | Request body is not valid JSON |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Unexpected server error |
| `NOT_FOUND` | Resource does not exist |
| `CONFLICT` | Resource already exists (use sparingly — see waitlist note above) |

---

## Client-Side Fetch Pattern

```ts
// Always use this pattern for API calls from React components
async function submitWaitlist(data: WaitlistFormData) {
  const response = await fetch('/api/waitlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // CSRF hint
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message ?? 'Request failed')
  }

  return response.json()
}
```

Never use `axios` — native `fetch` is sufficient and reduces bundle size.
