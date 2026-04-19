---
inclusion: fileMatch
fileMatchPattern: ["**/payment*", "**/notchpay*", "**/checkout*", "**/billing*"]
---

# Karu — Payment Integration

## Provider: NotchPay

Karu uses NotchPay as the primary payment aggregator for Cameroon.

### Why NotchPay
- Single integration covers MTN MoMo, Orange Money, Express Union, Visa, Mastercard
- 1% per local transaction — lowest available rate
- No setup fees, no monthly fees, no contracts
- JavaScript SDK (`notchpay.js`), sandbox environment, webhook support
- Cameroon-native — understands local payment flows and edge cases

### Credentials (environment variables only)
```env
NOTCHPAY_PUBLIC_KEY=[notchpay-public-key]
NOTCHPAY_SECRET_KEY=[notchpay-secret-key]
NOTCHPAY_WEBHOOK_SECRET=[webhook-secret]
NOTCHPAY_SANDBOX=true   # Set to false in production
```

---

## Payment Flow (Escrow Model)

```
Customer submits booking
    ↓
Vendor approves (24h window)
    ↓
Customer prompted to pay
    ↓
NotchPay initiates payment (MTN MoMo or Orange Money)
    ↓
Customer confirms on phone (PIN entry)
    ↓
NotchPay confirms via webhook → booking status: confirmed
    ↓
[Trip happens]
    ↓
Vendor marks return
    ↓
24–48h damage inspection window
    ↓
No dispute → Payout triggered (vendor receives 85%, Karu keeps 15%)
Dispute → Admin mediation → partial/full release decision
```

---

## Initiating a Payment

```javascript
import notchpay from 'notchpay'

const client = new notchpay(process.env.NOTCHPAY_SECRET_KEY)

async function initiateBookingPayment(booking) {
  const payment = await client.payments.initializePayment({
    currency: 'XAF',
    amount: booking.total_amount.toString(),
    phone: booking.customer_phone,
    reference: `booking_${booking.id}_${Date.now()}`,
    description: `Karu car rental — ${booking.listing_name}`,
    callback: `https://api.zanix.co/v1/payments/callback`,
    metadata: {
      booking_id: booking.id,
      customer_id: booking.customer_id,
      vendor_id: booking.vendor_id
    }
  })

  // Store payment reference in DB immediately
  await supabase.from('payments').insert({
    booking_id: booking.id,
    reference: payment.transaction.reference,
    amount: booking.total_amount,
    currency: 'XAF',
    status: 'pending',
    provider: 'notchpay'
  })

  return payment
}
```

---

## Completing a Payment (Channel Selection)

```javascript
async function completePayment(reference, channel, phone) {
  // channel: 'cm.mtn' for MTN MoMo, 'cm.orange' for Orange Money
  const result = await client.payments.completePayment(reference, {
    channel,
    data: { phone }
  })
  return result
}
```

---

## Webhook Handler

```typescript
// supabase/functions/payment-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import crypto from 'https://deno.land/std@0.168.0/node/crypto.ts'

serve(async (req) => {
  const payload = await req.text()
  const signature = req.headers.get('x-notchpay-signature') || ''
  const secret = Deno.env.get('NOTCHPAY_WEBHOOK_SECRET')!

  // ALWAYS verify signature first
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return new Response('Unauthorized', { status: 401 })
  }

  const event = JSON.parse(payload)

  switch (event.type) {
    case 'payment.complete':
      await handlePaymentComplete(event.data)
      break
    case 'payment.failed':
      await handlePaymentFailed(event.data)
      break
    case 'payment.pending':
      // Mobile money can be slow — keep booking in payment_pending state
      // Poll for status rather than waiting for webhook alone
      break
  }

  return new Response('OK', { status: 200 })
})
```

---

## Status Polling (Fallback)

Mobile networks in Cameroon can be unreliable. Always implement polling as a fallback
to webhooks — never rely on webhook alone for payment confirmation.

```typescript
async function pollPaymentStatus(reference: string, maxAttempts = 10) {
  let attempts = 0
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  while (attempts < maxAttempts) {
    const status = await client.payments.verifyPayment(reference)

    if (status.transaction.status === 'complete') {
      return { success: true, data: status }
    }

    if (status.transaction.status === 'failed') {
      return { success: false, data: status }
    }

    // Still pending — wait and retry
    attempts++
    await delay(3000) // 3-second intervals
  }

  return { success: false, timeout: true }
}
```

---

## Payout Calculation

```typescript
const PLATFORM_COMMISSION_RATE = 0.15  // 15%
const CUSTOMER_FEE_RATE = 0.08         // 8% (5–10% range)

function calculateBookingFinancials(dailyRate: number, days: number) {
  const subtotal = dailyRate * days
  const customerFee = Math.round(subtotal * CUSTOMER_FEE_RATE)
  const totalAmount = subtotal + customerFee
  const platformFee = Math.round(subtotal * PLATFORM_COMMISSION_RATE)
  const vendorPayout = subtotal - platformFee

  return {
    daily_rate: dailyRate,
    days,
    subtotal,
    customer_fee: customerFee,
    total_amount: totalAmount,    // What customer pays
    platform_fee: platformFee,    // Karu's revenue
    vendor_payout: vendorPayout   // What vendor receives
  }
}

// All amounts in XAF (Central African Franc)
// Always integers — no decimal XAF
```

---

## Idempotency Keys

Every payment initiation MUST include an idempotency key to prevent double charges:

```typescript
// Format: booking_{id}_attempt_{n}
const idempotencyKey = `booking_${bookingId}_attempt_${attemptNumber}`

// Store in DB with payment request
await supabase.from('payment_idempotency').upsert({
  key: idempotencyKey,
  booking_id: bookingId,
  created_at: new Date().toISOString()
})
```

---

## Error States

| State | Meaning | Action |
|---|---|---|
| `pending` | Awaiting customer PIN | Poll for 90 seconds, then mark timeout |
| `failed` | Customer rejected / insufficient funds | Notify customer, allow retry |
| `timeout` | No response from mobile money provider | Treat as failed, allow retry |
| `complete` | Payment confirmed | Update booking to confirmed, notify both parties |
| `refunded` | Payment reversed | Update booking to cancelled, notify both parties |

---

## Backup Provider: CinetPay

For regional expansion beyond Cameroon (Phase 3):

```env
CINETPAY_API_KEY=[cinetpay-api-key]
CINETPAY_SITE_ID=[cinetpay-site-id]
```

CinetPay covers 10 Francophone African countries at 1.5–3.5% fees.
Only activate when NotchPay is unavailable for a specific country.
