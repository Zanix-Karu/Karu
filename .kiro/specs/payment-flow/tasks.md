# Payment Flow — Implementation Tasks

## Phase 1: Database

- [ ] Create `payments` table with all fields and constraints
  _Requirements: data requirements_

- [ ] Create `payouts` table with retry tracking
  _Requirements: data requirements_

- [ ] Add unique constraint on `payments.idempotency_key`
  _Requirements: 1.7_

- [ ] Enable RLS on payments and payouts (customer reads own, vendor reads own payout)
  _Requirements: security.md_

- [ ] Set up pg_cron for reconciliation job (every 5 minutes)
  _Requirements: 1.8_

## Phase 2: Payment Initiation

- [ ] Create `payment-initiate` Edge Function
  _Requirements: 1.1, 1.2_

- [ ] Validate booking status is `approved` before initiating
  _Requirements: 1.2_

- [ ] Generate and store idempotency key on initiation
  _Requirements: 1.7_

- [ ] Create pending payment record before calling NotchPay
  _Requirements: 1.8_

- [ ] Call NotchPay `initializePayment()` with correct params
  _Requirements: payment-integration.md_

- [ ] Call NotchPay `completePayment()` with channel and phone
  _Requirements: payment-integration.md_

## Phase 3: Webhook Handler

- [ ] Create `payment-webhook` Edge Function
  _Requirements: 1.3_

- [ ] Implement `verifySignature()` using HMAC-SHA256
  _Requirements: security.md, payment-integration.md_

- [ ] Handle `payment.complete` event → update payment + confirm booking
  _Requirements: 1.3_

- [ ] Handle `payment.failed` event → update payment + notify customer
  _Requirements: 1.5_

- [ ] Add idempotency guard — skip if booking already confirmed
  _Requirements: 1.7_

- [ ] Block dates in `availability_blocks` on confirmation
  _Requirements: booking-flow spec_

- [ ] Notify both parties on payment confirmation (WhatsApp + email)
  _Requirements: 1.3_

## Phase 4: Polling Fallback

- [ ] Implement client-side `pollPaymentStatus()` (30 × 3s = 90s max)
  _Requirements: 1.4_

- [ ] Show animated pending state during polling (amber spinner, dark bg)
  _Requirements: design.md_

- [ ] Show timeout UI after 90s with retry option
  _Requirements: 1.4_

- [ ] Implement server-side `reconcileStuckPayments()` job
  _Requirements: 1.8_

## Phase 5: Payout

- [ ] Create `payout-vendor` Edge Function
  _Requirements: 1.9_

- [ ] Implement exponential backoff retry (max 3 attempts)
  _Requirements: 1.10_

- [ ] Alert admin if all payout retries exhausted
  _Requirements: 1.10_

- [ ] Record each payout attempt in `payouts` table
  _Requirements: 1.9_

## Phase 6: UI Components

- [ ] Build payment method selection screen (MTN MoMo | Orange Money)
  _Requirements: 1.1_

- [ ] Apply Karu design: amber MoMo button (#FFCC00 tint), orange OM button (#FF6600 tint)
  _Requirements: design.md_

- [ ] Build phone number entry for mobile money
  _Requirements: 1.2_

- [ ] Build payment pending screen with countdown animation
  _Requirements: 1.4_

- [ ] Build payment success screen with booking confirmation summary
  _Requirements: 1.3_

- [ ] Build payment failed screen with retry and alternative channel options
  _Requirements: 1.5_

## Phase 7: Testing & QA

- [ ] Test happy path: MTN MoMo → webhook arrives → booking confirmed → dates blocked
  _Requirements: 1.1–1.3_

- [ ] Test Orange Money channel end to end
  _Requirements: 1.1_

- [ ] Test idempotency: send same key twice → only one charge processed
  _Requirements: 1.7_

- [ ] Test webhook signature verification — reject requests with wrong sig
  _Requirements: security.md_

- [ ] Test polling fallback: disable webhook, verify polling detects completion
  _Requirements: 1.4_

- [ ] Test timeout scenario: no response in 90s → timeout UI shown → retry works
  _Requirements: 1.4_

- [ ] Test reconciliation: stuck pending payment reconciled within 5 mins
  _Requirements: 1.8_

- [ ] Test payout retry: first attempt fails → retries with backoff → succeeds
  _Requirements: 1.10_

- [ ] Test payout calculation: verify 15% commission split is correct to the XAF
  _Requirements: financial fields_

- [ ] Verify no payment data logged in plain text (no PII in logs)
  _Requirements: security.md_
