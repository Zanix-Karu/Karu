# Booking Flow — Requirements

## User Story
As a customer planning to visit Cameroon,
I want to browse verified cars and submit a booking request before I land,
so that my transport is confirmed and waiting when I arrive.

## Acceptance Criteria

WHEN a customer searches for vehicles with a city and date range,
THE SYSTEM SHALL return only verified, available vehicles (no availability conflicts for those dates).

WHEN a customer views a vehicle listing,
THE SYSTEM SHALL display: photos, daily rate in XAF, vendor name and rating, vehicle documents status, and pickup location options.

WHEN a customer submits a booking request,
THE SYSTEM SHALL create a booking record with status `pending_approval` and notify the vendor via WhatsApp and push notification.

WHEN a vendor approves a booking request within 24 hours,
THE SYSTEM SHALL update status to `approved` and prompt the customer to complete payment.

WHEN a vendor does not respond within 24 hours,
THE SYSTEM SHALL automatically cancel the booking, notify the customer, and unblock the dates.

WHEN a customer completes payment successfully,
THE SYSTEM SHALL update status to `confirmed`, block the dates in availability, and send confirmation to both parties via WhatsApp and email.

WHEN a customer arrives and collects the vehicle,
THE SYSTEM SHALL allow the vendor to mark the booking as `in_progress` and optionally upload a handover photo checklist.

WHEN a customer returns the vehicle,
THE SYSTEM SHALL allow the vendor to mark the booking as `returned` and start the 24-hour damage inspection window.

WHEN no damage claim is raised within 24 hours of return,
THE SYSTEM SHALL automatically move status to `completed`, trigger vendor payout, and prompt both parties for reviews.

WHEN a vendor raises a damage claim,
THE SYSTEM SHALL pause the payout, notify admin, and enter dispute resolution flow.

WHEN a customer attempts to book dates already confirmed for another booking,
THE SYSTEM SHALL block the request and show available alternative dates.

## Booking Lifecycle States

```
pending_approval   ← Initial state after customer submits
    ↓ vendor approves (within 24h)
approved           ← Awaiting customer payment
    ↓ vendor declines
declined           ← Terminal state, customer notified
    ↓ no response after 24h
auto_cancelled     ← Terminal state, customer notified
    ↓ customer pays
payment_pending    ← Payment initiated, awaiting confirmation
    ↓ payment confirmed
confirmed          ← Dates blocked, both parties notified
    ↓ vendor marks handover
in_progress        ← Trip active
    ↓ vendor marks return
returned           ← 24h damage window starts
    ↓ no claim raised
completed          ← Payout triggered, reviews prompted
    ↓ damage claim raised
disputed           ← Admin mediates
    ↓ resolved
resolved           ← Partial or full payout decided
```

## Financial Fields (all in XAF)

```
daily_rate          integer  ← vendor's listed price per day
days                integer  ← number of rental days
subtotal            integer  ← daily_rate × days
customer_fee        integer  ← 8% service fee added to customer total
total_amount        integer  ← subtotal + customer_fee (what customer pays)
platform_fee        integer  ← 15% of subtotal (Karu's revenue)
vendor_payout       integer  ← subtotal - platform_fee (what vendor receives)
deposit_amount      integer  ← optional security deposit (held, released on completion)
```

## Data Requirements

```sql
bookings (
  id                    uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id           uuid REFERENCES users(id),
  vendor_id             uuid REFERENCES users(id),
  listing_id            uuid REFERENCES listings(id),
  status                text NOT NULL DEFAULT 'pending_approval',
  pickup_date           timestamptz NOT NULL,
  return_date           timestamptz NOT NULL,
  pickup_location       text NOT NULL,
  daily_rate            integer NOT NULL,
  days                  integer NOT NULL,
  subtotal              integer NOT NULL,
  customer_fee          integer NOT NULL,
  total_amount          integer NOT NULL,
  platform_fee          integer NOT NULL,
  vendor_payout         integer NOT NULL,
  deposit_amount        integer DEFAULT 0,
  customer_note         text,
  vendor_response_deadline timestamptz,  -- created_at + 24h
  payment_reference     text,
  handover_photos       text[],
  damage_claim          text,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
)

availability_blocks (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id  uuid REFERENCES listings(id),
  booking_id  uuid REFERENCES bookings(id),
  start_date  date NOT NULL,
  end_date    date NOT NULL,
  reason      text CHECK (reason IN ('booking','maintenance','personal'))
)
```
