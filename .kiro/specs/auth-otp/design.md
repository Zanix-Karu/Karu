# Auth — Phone OTP — Technical Design

## Screen Flow

```
PhoneInput screen
    ↓ valid number entered + "Send Code" tapped
OTPVerification screen (120s countdown)
    ↓ correct code entered
    ├── New user → ProfileCompletion screen
    └── Existing user → Dashboard (or previous location)
```

## Supabase Auth Configuration

```typescript
// Supabase handles phone OTP natively
// Enable in: Supabase Dashboard → Auth → Providers → Phone

// lib/auth.ts
import { supabase } from './supabase'

export async function sendOTP(phone: string) {
  const normalised = normalisePhone(phone) // ensures +237 prefix

  const { error } = await supabase.auth.signInWithOtp({
    phone: normalised
  })

  if (error) throw error
  return { success: true }
}

export async function verifyOTP(phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: normalisePhone(phone),
    token,
    type: 'sms'
  })

  if (error) throw error
  return { session: data.session, user: data.user }
}

function normalisePhone(phone: string): string {
  // Strip all non-digits
  const digits = phone.replace(/\D/g, '')
  // Add +237 if not present
  if (digits.startsWith('237')) return `+${digits}`
  if (digits.startsWith('6') || digits.startsWith('2')) return `+237${digits}`
  return `+${digits}`
}
```

## Africa's Talking SMS Integration

Supabase's built-in SMS uses Twilio by default. Override with Africa's Talking
for Cameroon-optimised pricing and delivery rates.

```typescript
// supabase/functions/send-otp-sms/index.ts
// Custom Edge Function to send OTP via Africa's Talking
import AfricasTalking from 'africastalking'

const at = AfricasTalking({
  apiKey: Deno.env.get('AT_API_KEY')!,
  username: Deno.env.get('AT_USERNAME')!
})

export async function sendSMS(phone: string, message: string) {
  const sms = at.SMS
  await sms.send({
    to: [phone],
    message,
    from: 'Karu'
  })
}
```

## Rate Limiting

```typescript
// lib/rateLimit.ts
export async function checkOTPRateLimit(phoneHash: string): Promise<boolean> {
  const { data } = await supabase
    .from('otp_rate_limits')
    .select('*')
    .eq('phone_hash', phoneHash)
    .single()

  if (!data) return true // No record = not rate limited

  const windowExpired = new Date(data.window_start).getTime() + 10 * 60 * 1000 < Date.now()

  if (windowExpired) {
    // Reset window
    await supabase.from('otp_rate_limits')
      .update({ attempts: 0, window_start: new Date().toISOString() })
      .eq('phone_hash', phoneHash)
    return true
  }

  if (data.blocked_until && new Date(data.blocked_until) > new Date()) {
    return false // Still blocked
  }

  return data.attempts < 3
}
```

## Session Management

```typescript
// On app load — restore session
const { data: { session } } = await supabase.auth.getSession()

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Redirect to dashboard
  }
  if (event === 'TOKEN_REFRESHED') {
    // Store new tokens
  }
  if (event === 'SIGNED_OUT') {
    // Clear local state, redirect to login
  }
})
```

## Sequence Diagram

```
User enters phone → normalise → checkRateLimit
                                    ↓ blocked → show countdown timer
                                    ↓ allowed
                              supabase.auth.signInWithOtp(phone)
                              Africa's Talking sends SMS
                              show OTPVerification screen (120s countdown)
                                    ↓ user enters code
                              supabase.auth.verifyOtp(phone, token)
                                    ↓ invalid → decrement attempts, show remaining
                                    ↓ expired → show expiry, offer resend
                                    ↓ valid
                              session created
                                    ↓ new user → ProfileCompletion
                                    ↓ existing → Dashboard
```
