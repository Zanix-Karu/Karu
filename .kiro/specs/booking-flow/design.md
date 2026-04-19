# Booking Flow — Technical Design

## Availability Search Query

```sql
-- Find available vehicles: exclude listings with conflicting blocks
SELECT l.*, v.*
FROM listings l
JOIN vehicles v ON l.vehicle_id = v.id
JOIN vendor_profiles vp ON v.vendor_id = vp.id
WHERE
  l.city = :city
  AND vp.status = 'verified'
  AND v.status = 'active'
  AND l.id NOT IN (
    SELECT listing_id FROM availability_blocks
    WHERE NOT (end_date < :pickup_date OR start_date > :return_date)
  )
ORDER BY l.daily_rate ASC;
```

## Booking State Machine

```typescript
// lib/bookingStateMachine.ts
type BookingStatus =
  | 'pending_approval' | 'approved' | 'declined' | 'auto_cancelled'
  | 'payment_pending' | 'confirmed' | 'in_progress'
  | 'returned' | 'completed' | 'disputed' | 'resolved'

const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending_approval: ['approved', 'declined', 'auto_cancelled'],
  approved:         ['payment_pending', 'auto_cancelled'],
  payment_pending:  ['confirmed', 'payment_failed'],
  confirmed:        ['in_progress'],
  in_progress:      ['returned'],
  returned:         ['completed', 'disputed'],
  disputed:         ['resolved'],
  declined:         [],
  auto_cancelled:   [],
  payment_failed:   ['payment_pending'],
  completed:        [],
  resolved:         [],
}

export function canTransition(from: BookingStatus, to: BookingStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false
}
```

## Auto-Cancel Job (24h Vendor Response)

```typescript
// supabase/functions/booking-auto-cancel/index.ts
// Called by Supabase pg_cron every 15 minutes

export async function cancelExpiredBookings() {
  const { data: expired } = await supabase
    .from('bookings')
    .select('id, vendor_id, customer_id')
    .eq('status', 'pending_approval')
    .lt('vendor_response_deadline', new Date().toISOString())

  for (const booking of expired ?? []) {
    await supabase
      .from('bookings')
      .update({ status: 'auto_cancelled', updated_at: new Date().toISOString() })
      .eq('id', booking.id)

    await notifyCustomerAutoCancelled(booking.customer_id, booking.id)
  }
}
```

## Vendor Notification (new booking)

```typescript
async function notifyVendorNewBooking(booking: Booking) {
  // Push notification
  await expoPush.sendPushNotificationsAsync([{
    to: vendor.push_token,
    title: 'New booking request',
    body: `${customer.name} wants to book your ${vehicle.make} ${vehicle.model}`,
    data: { bookingId: booking.id }
  }])

  // WhatsApp via Africa's Talking
  await africasTalking.SMS.send({
    to: [vendor.phone],
    message: `Nouvelle réservation Karu! ${customer.name} souhaite louer votre ${vehicle.make} du ${formatDate(booking.pickup_date)} au ${formatDate(booking.return_date)}. Répondez dans 24h. / New Karu booking! Open the app to approve or decline.`
  })
}
```

## Date Blocking on Confirmation

```typescript
async function blockDatesOnConfirmation(booking: Booking) {
  await supabase.from('availability_blocks').insert({
    listing_id: booking.listing_id,
    booking_id: booking.id,
    start_date: booking.pickup_date,
    end_date: booking.return_date,
    reason: 'booking'
  })
}

async function unblockDatesOnCancellation(bookingId: string) {
  await supabase
    .from('availability_blocks')
    .delete()
    .eq('booking_id', bookingId)
}
```

## Payout Trigger on Completion

```typescript
async function triggerVendorPayout(booking: Booking) {
  // Initiate payout via NotchPay
  await notchpay.payouts.send({
    phone: vendor.payout_phone,
    channel: vendor.payout_method, // 'cm.mtn' or 'cm.orange'
    amount: booking.vendor_payout.toString(),
    currency: 'XAF',
    reference: `payout_${booking.id}`,
    description: `Karu payout — booking ${booking.id}`
  })

  await supabase.from('bookings')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', booking.id)

  // Prompt reviews from both parties
  await notifyBothPartiesForReview(booking)
}
```

## Sequence Diagram

```
Customer searches (city + dates)
    → filtered listing results
Customer selects vehicle + submits request
    → booking created (pending_approval)
    → vendor notified (push + WhatsApp)
    → vendor_response_deadline set (+24h)

[24h window]
Vendor approves
    → status: approved
    → customer notified to pay

Customer pays (MTN MoMo / Orange Money)
    → payment_pending
    → NotchPay webhook → confirmed
    → dates blocked in availability_blocks
    → both parties notified (WhatsApp + email)

[Trip day]
Vendor marks handover → in_progress
Vendor marks return → returned
    → 24h damage window starts

[24h passes — no claim]
Auto job → completed
    → vendor payout triggered
    → review prompts sent

[Damage claim raised]
→ disputed
→ admin mediates
→ resolved (partial/full payout)
```
