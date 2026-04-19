# Auth — Phone OTP — Requirements

## User Story
As a new or returning user of the Karu app,
I want to sign in with my Cameroonian phone number and a one-time code,
so that I can access my account without needing to remember a password.

## Acceptance Criteria

WHEN a user enters a valid Cameroonian phone number (starting with +237),
THE SYSTEM SHALL send a 6-digit OTP via SMS through Africa's Talking.

WHEN a user enters a phone number in an invalid format,
THE SYSTEM SHALL display an inline error without sending an OTP.

WHEN a user enters the correct OTP within the 120-second window,
THE SYSTEM SHALL authenticate the user, create a session, and redirect to their dashboard.

WHEN a user enters an incorrect OTP,
THE SYSTEM SHALL decrement the attempt counter and display the remaining attempts (max 3).

WHEN a user exhausts 3 OTP attempts,
THE SYSTEM SHALL invalidate the OTP and require them to request a new one.

WHEN an OTP expires after 120 seconds,
THE SYSTEM SHALL display an expiry message and allow the user to request a new OTP.

WHEN a phone number requests more than 3 OTPs within 10 minutes,
THE SYSTEM SHALL block further requests and display a rate limit message with countdown.

WHEN a new phone number completes OTP verification for the first time,
THE SYSTEM SHALL create a new user account with role 'customer' and redirect to profile completion.

WHEN an existing phone number completes OTP verification,
THE SYSTEM SHALL restore their session and redirect to their previous location or dashboard.

WHEN a user is on a slow network (3G / intermittent),
THE SYSTEM SHALL show clear loading states and retry options without data loss.

## Security Requirements

- OTPs: 6-digit numeric only, cryptographically random
- OTP expiry: 120 seconds (hard limit)
- Max attempts: 3 per OTP code
- Rate limit: 3 OTP requests per phone number per 10 minutes
- OTPs stored as bcrypt hash — NEVER plain text
- Error messages NEVER reveal whether a phone number is registered
- JWT access tokens: RS256, 15-minute expiry
- Refresh tokens: stored in device secure storage, rotate on each use

## Phone Number Handling

- Accept Cameroon numbers: +237 6XX XXX XXX and +237 2XX XXX XXX
- Accept input with or without +237 prefix — normalise before sending
- Strip spaces, dashes, parentheses from input
- Display masked number in OTP verification screen: +237 *** *** 45

## Data Requirements

```sql
-- No separate OTP table needed — Supabase Auth handles OTP via phone
-- Custom rate limiting table:
otp_rate_limits (
  phone_hash  text PRIMARY KEY,  -- bcrypt hash of phone number
  attempts    integer DEFAULT 0,
  window_start timestamptz DEFAULT now(),
  blocked_until timestamptz
)
```
