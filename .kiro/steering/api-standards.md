---
inclusion: fileMatch
fileMatchPattern: ["**/api/**", "**/routes/**", "**/*.api.ts", "**/supabase/**"]
---

# Karu — API Standards

## REST Conventions

### Base URL
```
Production:  https://api.zanix.co/v1
Staging:     https://api.staging.zanix.co/v1
Local:       http://localhost:3000/api/v1
```

### HTTP Methods
```
GET     /listings              ← list resources
GET     /listings/:id          ← get single resource
POST    /listings              ← create resource
PATCH   /listings/:id          ← partial update
DELETE  /listings/:id          ← soft delete (set deleted_at)
```

NEVER use PUT — always PATCH for updates.
NEVER hard delete records — always soft delete with `deleted_at` timestamp.

### URL Conventions
- kebab-case for all paths: `/vendor-profiles`, `/booking-requests`
- UUIDs for resource IDs: `/bookings/550e8400-e29b-41d4-a716-446655440000`
- NEVER sequential integers in URLs: `/bookings/1` ← forbidden
- Version prefix always present: `/v1/`

---

## Request Format

```typescript
// All requests use JSON
Content-Type: application/json
Authorization: Bearer <jwt-access-token>

// Example create booking request
POST /v1/bookings
{
  "listing_id": "uuid",
  "pickup_date": "2025-07-14T08:00:00Z",
  "return_date": "2025-07-18T18:00:00Z",
  "pickup_location": "Douala Airport Terminal 1",
  "customer_note": "Optional note to vendor"
}
```

---

## Response Format

### Success
```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2025-07-01T12:00:00Z",
    "version": "1"
  }
}
```

### List Response (paginated)
```json
{
  "data": [ ... ],
  "meta": {
    "total": 120,
    "page": 1,
    "per_page": 20,
    "timestamp": "2025-07-01T12:00:00Z"
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "BOOKING_CONFLICT",
    "message": "The selected dates are not available for this listing.",
    "field": "pickup_date"
  },
  "meta": {
    "timestamp": "2025-07-01T12:00:00Z",
    "request_id": "uuid"
  }
}
```

---

## Error Codes

| HTTP Status | Error Code | Meaning |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Invalid input data |
| 400 | `BOOKING_CONFLICT` | Date conflict with existing booking |
| 401 | `UNAUTHORIZED` | Missing or invalid JWT |
| 401 | `TOKEN_EXPIRED` | JWT has expired — refresh required |
| 403 | `FORBIDDEN` | Authenticated but insufficient permissions |
| 403 | `RESOURCE_NOT_OWNED` | User doesn't own this resource |
| 404 | `NOT_FOUND` | Resource does not exist |
| 409 | `ALREADY_EXISTS` | Duplicate resource (e.g. email taken) |
| 422 | `UNPROCESSABLE` | Semantically invalid request |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error — never expose details |

NEVER return raw database errors, stack traces, or internal implementation details.

---

## Booking Lifecycle States

```
pending_approval → approved → payment_pending → confirmed → in_progress → completed
                ↘ declined
                             ↘ payment_failed → cancelled
                                               ↘ disputed → resolved
```

Vendor has 24 hours to approve/decline (`vendor_response_deadline`).
Auto-cancel if no response within deadline.

---

## Supabase Edge Functions

Functions live at `supabase/functions/` and are deployed via Supabase CLI.

```typescript
// Example: supabase/functions/booking-confirm/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Always validate auth first
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: { code: 'UNAUTHORIZED', message: 'Missing token' } }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Implementation...
})
```

---

## Idempotency (Payments)

All payment initiation endpoints accept an `Idempotency-Key` header:

```
POST /v1/payments/initiate
Idempotency-Key: booking_550e8400-e29b-41d4-a716-446655440000_attempt_1
```

If the same key is used twice, return the cached response from the first request.
Store idempotency keys with 24-hour TTL in Supabase.

---

## Webhook Verification (NotchPay)

```typescript
import crypto from 'crypto'

function verifyNotchPayWebhook(payload: string, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  )
}
```

ALWAYS verify webhook signatures before processing payment events.
NEVER trust payment status from client-side — always verify server-to-server.
