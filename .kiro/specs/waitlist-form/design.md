# Waitlist Form — Technical Design

## Component Architecture

```
CTASection
├── KaruTag           ("Early Access")
├── CTATitle          (large serif headline)
├── CTASubtitle       (1-sentence description)
├── WaitlistForm
│   ├── EmailInput
│   ├── TypeToggle    (Customer / Vendor)
│   └── SubmitButton
├── CTANote           ("No spam · We'll notify you when we launch")
└── KeyboardVisual    (⌘ + ↵ keys)
```

## Supabase Integration

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Form submission handler
async function submitWaitlist(email: string, type: 'customer' | 'vendor', source: string) {
  const { error } = await supabase
    .from('waitlist')
    .insert([{ email, type, source }])

  if (error?.code === '23505') {
    // Unique constraint violation — already registered
    return { success: false, duplicate: true }
  }

  if (error) {
    return { success: false, error: true }
  }

  return { success: true }
}
```

## RLS Policy

```sql
-- Allow anonymous inserts (waitlist form)
CREATE POLICY "Allow public insert on waitlist"
  ON waitlist FOR INSERT
  WITH CHECK (true);

-- Block all reads/updates/deletes from public
CREATE POLICY "Block public read on waitlist"
  ON waitlist FOR SELECT
  USING (false);
```

## State Machine

```
idle
  → submitting (on form submit)
    → success (on successful insert)
    → duplicate (on 23505 error)
    → error (on other error)
  success → idle (after 5 seconds or on new input)
  duplicate → idle (after 4 seconds)
  error → idle (user can retry immediately)
```

## Email Validation Regex
```typescript
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

## Sequence Diagram

```
User → Form: enters email + selects type
Form → Supabase: INSERT INTO waitlist
Supabase → Form: success / duplicate / error
Form → User: shows appropriate message
Form → Resend (optional): sends confirmation email
```

## Confirmation Email (Resend — optional Phase 1)

```typescript
await resend.emails.send({
  from: 'Karu <noreply@getkaru.io>',
  to: email,
  reply_to: 'hello@getkaru.io',
  subject: "You're on the Karu waitlist! / Vous êtes sur la liste d'attente Karu !",
  html: waitlistConfirmationTemplate(type)
})
```
