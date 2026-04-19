# Auth — Phone OTP — Implementation Tasks

## Phase 1: Supabase Auth Setup

- [ ] Enable Phone provider in Supabase Auth settings
  _Requirements: 1.1_

- [ ] Configure Africa's Talking as SMS provider via Supabase custom SMS hook
  _Requirements: 1.1, tech.md_

- [ ] Add `AT_API_KEY` and `AT_USERNAME` to environment variables
  _Requirements: tech.md_

- [ ] Create `otp_rate_limits` table with RLS (service_role only)
  _Requirements: 1.7_

- [ ] Test OTP send and receive in Supabase sandbox
  _Requirements: 1.1_

## Phase 2: Auth Logic

- [ ] Create `lib/auth.ts` with `sendOTP()` and `verifyOTP()` functions
  _Requirements: 1.1, 1.3_

- [ ] Create `normalisePhone()` utility — handles +237, 6XX, 2XX formats
  _Requirements: phone number handling_

- [ ] Implement `checkOTPRateLimit()` in `lib/rateLimit.ts`
  _Requirements: 1.7_

- [ ] Implement `incrementOTPAttempts()` and `blockPhone()` helpers
  _Requirements: 1.4, 1.7_

- [ ] Implement session restoration on app load
  _Requirements: 1.9_

- [ ] Implement `onAuthStateChange` listener with routing logic
  _Requirements: 1.8, 1.9_

## Phase 3: PhoneInput Screen

- [ ] Build `PhoneInput` screen with Cameroon flag prefix (+237)
  _Requirements: 1.1, 1.2_

- [ ] Add phone number format validation inline
  _Requirements: 1.2_

- [ ] Add "Send Code" button with loading state
  _Requirements: 1.1_

- [ ] Show generic error on send failure (never reveal if number is registered)
  _Requirements: security.md_

- [ ] Apply Karu design tokens (dark background, amber CTA, cream input)
  _Requirements: design.md_

## Phase 4: OTPVerification Screen

- [ ] Build `OTPVerification` screen with 6-digit input (individual boxes or single field)
  _Requirements: 1.3_

- [ ] Add 120-second countdown timer with visual indicator
  _Requirements: 1.6_

- [ ] Show masked phone number: +237 *** *** 45
  _Requirements: phone number handling_

- [ ] Show remaining attempts counter after first wrong attempt
  _Requirements: 1.4_

- [ ] Show "Request new code" button after expiry or exhausted attempts
  _Requirements: 1.5, 1.6_

- [ ] Show rate limit countdown when blocked (mm:ss remaining)
  _Requirements: 1.7_

- [ ] Auto-submit when all 6 digits entered
  _Requirements: UX improvement_

- [ ] Apply Karu design tokens
  _Requirements: design.md_

## Phase 5: Post-Auth Routing

- [ ] Check if user has completed profile after first sign-in
  _Requirements: 1.8_

- [ ] Redirect new users to `ProfileCompletion` screen
  _Requirements: 1.8_

- [ ] Redirect returning users to dashboard or previous deep-link
  _Requirements: 1.9_

## Phase 6: Testing & QA

- [ ] Test valid Cameroon number formats: +2376XXXXXXXX, 6XXXXXXXX, +2372XXXXXXXX
  _Requirements: 1.1, phone normalisation_

- [ ] Test invalid formats are blocked before SMS send
  _Requirements: 1.2_

- [ ] Test correct OTP → session created → dashboard redirect
  _Requirements: 1.3_

- [ ] Test wrong OTP → attempts decrement correctly
  _Requirements: 1.4_

- [ ] Test 3 wrong attempts → OTP invalidated, resend required
  _Requirements: 1.4_

- [ ] Test OTP expiry at 120 seconds → expiry message shown
  _Requirements: 1.6_

- [ ] Test rate limit: 4 requests in 10 min → blocked
  _Requirements: 1.7_

- [ ] Test slow network: loading states remain stable
  _Requirements: 1.10_

- [ ] Test error messages never reveal if number is registered
  _Requirements: security.md_
