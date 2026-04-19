# Waitlist Form — Implementation Tasks

- [ ] Create `waitlist` table in Supabase with correct schema
      _Requirements: Email Capture, Data Schema_

- [ ] Add RLS policies: public INSERT allowed, all else blocked
      _Requirements: Email Capture, Non-Functional_

- [ ] Create `lib/supabase.ts` with typed client
      _Requirements: Email Capture_

- [ ] Build `WaitlistForm` component with email input and submit button
      _Requirements: Email Capture_

- [ ] Add inline email validation (format check before submit)
      _Requirements: Email Capture_

- [ ] Add type toggle (Customer / Vendor) with default to "customer"
      _Requirements: Type Selection_

- [ ] Add source tracking parameter to identify which form instance
      _Requirements: Analytics_

- [ ] Handle duplicate email (Supabase error code 23505) with friendly message
      _Requirements: Email Capture_

- [ ] Handle network errors with retry-friendly error state
      _Requirements: Error State_

- [ ] Implement success state with message and input clear
      _Requirements: Success State_

- [ ] Add ⌘+Enter / Ctrl+Enter keyboard shortcut
      _Requirements: Keyboard Shortcut_

- [ ] Style keyboard visual (⌘ + ↵ physical key aesthetic)
      _Requirements: Keyboard Shortcut_

- [ ] Add ARIA labels and keyboard navigation support
      _Requirements: Non-Functional_

- [ ] Add form to hero section AND CTA section with different source values
      _Requirements: Analytics_

- [ ] Test on slow 3G connection (Chrome DevTools throttle)
      _Requirements: Non-Functional_
