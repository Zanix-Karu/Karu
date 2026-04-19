# Payment Flow — Technical Design

## Payment Initiation

```typescript
// supabase/functions/payment-initiate/index.ts
export async function initiatePayment(bookingId: string, channel: 'cm.mtn' | 'cm.orange', phone: string) {
  // 1. Fetch booking and validate status
  const { data: booking } = await supabase
    .from('bookings').select('*').eq('id', bookingId).single()

  if (booking.status !== 'approved') throw new Error('Booking not in approved state')

  // 2. Generate idempotency key
  const idempotencyKey = `booking_${bookingId}_${Date.now()}`

  // 3. Check for existing payment record (prevent duplicate)
  const { data: existing } = await supabase
    .from('payments').select('*').eq('booking_id', bookingId).single()

  if (existing?.status === 'complete') return { alreadyPaid: true }

  // 4. Create pending payment record
  const { data: payment } = await supabase.from('payments').insert({
    booking_id: bookingId,
    amount: booking.total_amount,
    channel,
    status: 'pending',
    idempotency_key: idempotencyKey
  }).select().single()

  // 5. Call NotchPay
  const notchpayResponse = await notchpay.payments.initializePayment({
    currency: 'XAF',
    amount: booking.total_amount.toString(),
    phone,
    reference: idempotencyKey,
    description: `Karu booking ${bookingId}`,
    callback: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/payments/callback`,
    metadata: { booking_id: bookingId, payment_id: payment.id }
  })

  // 6. Update payment with NotchPay reference
  await supabase.from('payments')
    .update({ reference: notchpayResponse.transaction.reference })
    .eq('id', payment.id)

  // 7. Trigger channel completion
  await notchpay.payments.completePayment(
    notchpayResponse.transaction.reference,
    { channel, data: { phone } }
  )

  return { paymentId: payment.id, reference: notchpayResponse.transaction.reference }
}
```

## Webhook Handler

```typescript
// supabase/functions/payment-webhook/index.ts
serve(async (req) => {
  const payload = await req.text()
  const sig = req.headers.get('x-notchpay-signature') || ''

  // 1. Verify signature
  if (!verifySignature(payload, sig, process.env.NOTCHPAY_WEBHOOK_SECRET!)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const event = JSON.parse(payload)

  if (event.type === 'payment.complete') {
    const { booking_id } = event.data.metadata

    // 2. Update payment status
    await supabase.from('payments')
      .update({ status: 'complete', webhook_received_at: new Date().toISOString() })
      .eq('reference', event.data.reference)

    // 3. Transition booking to confirmed
    await supabase.from('bookings')
      .update({ status: 'confirmed', updated_at: new Date().toISOString() })
      .eq('id', booking_id)
      .eq('status', 'approved') // guard against duplicate webhooks

    // 4. Block dates
    await blockDatesOnConfirmation(booking_id)

    // 5. Notify both parties
    await notifyPaymentConfirmed(booking_id)
  }

  if (event.type === 'payment.failed') {
    await supabase.from('payments')
      .update({ status: 'failed' })
      .eq('reference', event.data.reference)

    await notifyPaymentFailed(event.data.metadata.booking_id)
  }

  return new Response('OK', { status: 200 })
})
```

## Polling Fallback (90 second timeout)

```typescript
// Client-side polling when webhook is slow
export async function pollPaymentStatus(reference: string): Promise<'complete' | 'failed' | 'timeout'> {
  const maxAttempts = 30 // 30 × 3s = 90s
  let attempts = 0

  while (attempts < maxAttempts) {
    await sleep(3000)

    const { data } = await supabase
      .from('payments').select('status').eq('reference', reference).single()

    if (data?.status === 'complete') return 'complete'
    if (data?.status === 'failed') return 'failed'

    attempts++
  }

  return 'timeout'
}
```

## Vendor Payout with Retry

```typescript
// supabase/functions/payout-vendor/index.ts
export async function processVendorPayout(bookingId: string) {
  const { data: booking } = await supabase
    .from('bookings').select('*, vendor_profiles(payout_method, payout_phone)')
    .eq('id', bookingId).single()

  const maxRetries = 3
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      const result = await notchpay.payouts.send({
        phone: booking.vendor_profiles.payout_phone,
        channel: booking.vendor_profiles.payout_method,
        amount: booking.vendor_payout.toString(),
        currency: 'XAF',
        reference: `payout_${bookingId}_${attempt}`,
        description: `Karu payout — ${bookingId}`
      })

      await supabase.from('payouts').insert({
        booking_id: bookingId,
        vendor_id: booking.vendor_id,
        amount: booking.vendor_payout,
        status: 'complete',
        reference: result.reference
      })

      return { success: true }
    } catch (err) {
      attempt++
      if (attempt < maxRetries) {
        await sleep(Math.pow(2, attempt) * 1000) // exponential backoff
      }
    }
  }

  // All retries exhausted — alert admin
  await alertAdminPayoutFailed(bookingId)
  return { success: false }
}
```

## Reconciliation Job

```typescript
// supabase/functions/payment-reconcile/index.ts
// Runs every 5 minutes via pg_cron
// Finds payments stuck in 'pending' for > 10 minutes and polls NotchPay

export async function reconcileStuckPayments() {
  const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()

  const { data: stuck } = await supabase
    .from('payments')
    .select('reference, booking_id')
    .eq('status', 'pending')
    .lt('created_at', tenMinsAgo)

  for (const payment of stuck ?? []) {
    const status = await notchpay.payments.verifyPayment(payment.reference)

    if (status.transaction.status === 'complete') {
      // Process as if webhook arrived
      await handlePaymentComplete(payment)
    }
  }
}
```
