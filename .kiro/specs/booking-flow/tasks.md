# Booking Flow — Implementation Tasks

## Phase 1: Database

- [ ] Create `listings` table (bookable configuration of a vehicle)
  _Requirements: data requirements_

- [ ] Create `bookings` table with all financial and status fields
  _Requirements: data requirements_

- [ ] Create `availability_blocks` table with date range and reason
  _Requirements: data requirements_

- [ ] Add `vendor_response_deadline` computed on insert (created_at + 24h)
  _Requirements: 1.5_

- [ ] Enable RLS on all booking tables
  _Requirements: security.md_

- [ ] Create RLS policy: customer reads own bookings only
  _Requirements: security.md_

- [ ] Create RLS policy: vendor reads bookings for their listings only
  _Requirements: security.md_

- [ ] Create RLS policy: admin reads all bookings
  _Requirements: security.md_

- [ ] Set up pg_cron job for auto-cancel check every 15 minutes
  _Requirements: 1.5_

## Phase 2: Search

- [ ] Implement availability search query with date conflict exclusion
  _Requirements: 1.1_

- [ ] Add filters: city, date range, vehicle type, max price, seats
  _Requirements: 1.1_

- [ ] Add PostGIS distance sorting for "near me" results
  _Requirements: tech.md_

- [ ] Return only verified vendors and active vehicles in results
  _Requirements: 1.1_

## Phase 3: Booking Request

- [ ] Build `createBooking()` function with financial calculations
  _Requirements: 1.3, financial fields_

- [ ] Validate date range does not conflict with existing blocks
  _Requirements: 1.11_

- [ ] Set `vendor_response_deadline` = now() + 24 hours on creation
  _Requirements: 1.5_

- [ ] Notify vendor via push notification on new booking
  _Requirements: 1.3_

- [ ] Notify vendor via WhatsApp (bilingual) on new booking
  _Requirements: 1.3_

## Phase 4: Booking State Machine

- [ ] Implement `canTransition()` state machine validation
  _Requirements: booking lifecycle_

- [ ] Implement `transitionBooking()` with guard and audit log
  _Requirements: booking lifecycle_

- [ ] Implement `approveBooking()` — vendor action
  _Requirements: 1.4_

- [ ] Implement `declineBooking()` — vendor action with reason
  _Requirements: 1.4_

- [ ] Implement `cancelExpiredBookings()` Edge Function (auto-cancel)
  _Requirements: 1.5_

- [ ] Implement `markHandover()` — vendor marks trip started
  _Requirements: 1.7_

- [ ] Implement `markReturn()` — vendor marks trip ended, starts 24h window
  _Requirements: 1.8_

- [ ] Implement `completeBooking()` auto job — runs after 24h, no claim raised
  _Requirements: 1.9_

## Phase 5: Payment Integration

- [ ] Wire booking confirmation to NotchPay payment initiation
  _Requirements: payment-integration.md_

- [ ] Block dates in `availability_blocks` on payment confirmation
  _Requirements: 1.6_

- [ ] Unblock dates if payment fails or booking is cancelled
  _Requirements: 1.5_

- [ ] Trigger vendor payout on booking completion
  _Requirements: 1.9_

## Phase 6: Notifications

- [ ] Notify customer: booking submitted (confirmation)
  _Requirements: 1.3_

- [ ] Notify customer: booking approved by vendor
  _Requirements: 1.4_

- [ ] Notify customer: auto-cancelled after 24h
  _Requirements: 1.5_

- [ ] Notify customer: payment confirmed, booking locked in
  _Requirements: 1.6_

- [ ] Notify vendor: payment received, booking confirmed
  _Requirements: 1.6_

- [ ] Notify both: review prompt after completion
  _Requirements: 1.9_

- [ ] Send 24h pre-pickup reminder to both parties
  _Requirements: UX improvement_

## Phase 7: Testing & QA

- [ ] Test happy path: search → book → approve → pay → trip → complete → payout
  _Requirements: 1.1–1.9_

- [ ] Test date conflict: attempt to book dates already blocked
  _Requirements: 1.11_

- [ ] Test vendor decline: customer notified, dates remain available
  _Requirements: 1.4_

- [ ] Test auto-cancel: no vendor response after 24h → cancelled, dates unblocked
  _Requirements: 1.5_

- [ ] Test payout calculation: verify correct 15% commission split
  _Requirements: financial fields_

- [ ] Test dispute flow: damage claim raised → admin notified → payout paused
  _Requirements: 1.10_

- [ ] Test RLS: customer cannot see another customer's bookings
  _Requirements: security.md_
