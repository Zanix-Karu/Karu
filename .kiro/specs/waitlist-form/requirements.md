# Waitlist Form — Requirements

## User Story
As a traveler or vendor visiting getkaru.io before launch,
I want to register my interest with my email address,
So that I am notified when Karu goes live in my city.

## Acceptance Criteria

### Email Capture
- WHEN a user enters a valid email address and clicks "Join Waitlist"
  THE SYSTEM SHALL insert the email into the `waitlist` Supabase table
- WHEN a user submits an email that already exists in the waitlist
  THE SYSTEM SHALL show a friendly message: "You're already on the list!"
- WHEN a user submits an invalid email format
  THE SYSTEM SHALL show inline validation: "Please enter a valid email address"
- WHEN a user submits an empty form
  THE SYSTEM SHALL prevent submission and highlight the empty field

### Type Selection
- WHEN a user pre-registers
  THE SYSTEM SHALL capture whether they are a "customer" or "vendor"
  via a toggle or radio selection before or alongside the email field
- WHEN no type is selected
  THE SYSTEM SHALL default to "customer"

### Keyboard Shortcut
- WHEN a user presses ⌘+Enter (Mac) or Ctrl+Enter (Windows)
  THE SYSTEM SHALL submit the waitlist form
- WHEN the form is submitted via keyboard shortcut
  THE SYSTEM SHALL behave identically to clicking "Join Waitlist"

### Success State
- WHEN submission succeeds
  THE SYSTEM SHALL display: "You're on the list! We'll notify you when Karu launches in your city."
- WHEN submission succeeds
  THE SYSTEM SHALL clear the email input field
- WHEN submission succeeds
  THE SYSTEM SHALL disable the submit button to prevent duplicate submissions

### Error State
- WHEN the Supabase insert fails due to a network error
  THE SYSTEM SHALL display: "Something went wrong. Please try again."
- WHEN the Supabase insert fails
  THE SYSTEM SHALL NOT clear the email field (allow retry without re-typing)

### Analytics
- WHEN a successful submission occurs
  THE SYSTEM SHALL record the `source` field (e.g. "hero", "cta-section", "footer")
  based on which form instance was used

## Data Schema
```sql
waitlist (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email      text NOT NULL UNIQUE,
  type       text CHECK (type IN ('customer','vendor')) DEFAULT 'customer',
  city       text,
  source     text,
  created_at timestamptz DEFAULT now()
)
```

## Non-Functional Requirements
- Form must be accessible (ARIA labels, keyboard navigable)
- Submission must complete within 2 seconds on a 3G connection
- Email stored in Supabase only — NEVER sent to a third-party without consent
- RLS policy: INSERT allowed for anonymous users, SELECT/UPDATE/DELETE forbidden
