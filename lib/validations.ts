import { z } from 'zod'

/**
 * Version of the privacy notice the user consents to at signup.
 * Bump this whenever the privacy policy materially changes —
 * stored per entry as consent_version (Law 2024/017 consent record).
 */
export const CONSENT_VERSION = '2026-06-10'

/**
 * Strip HTML tags and dangerous characters from user input.
 * Defence-in-depth: Supabase uses parameterised queries so SQL injection
 * is not possible via the client library, but we sanitise anyway.
 */
function sanitise(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')       // strip HTML tags
    .replace(/[<>"'`;\\]/g, '')    // strip characters that could be used in injection attempts
    .trim()
}

const sanitisedString = (maxLen: number) =>
  z.string().max(maxLen).transform(sanitise)

const BaseWaitlistSchema = z.object({
  email: z.string().email('Please enter a valid email').max(254).toLowerCase().trim(),
  type: z.enum(['customer', 'vendor'], { required_error: 'Please select customer or vendor' }),
  city: z.enum(['douala', 'yaounde', 'other'], { required_error: 'Please select a city' }),
  locale: z.enum(['en', 'fr']).optional().default('en'),
  business_name: sanitisedString(200).optional().or(z.literal('')),
  business_email: z.string().email().max(254).toLowerCase().trim().optional().or(z.literal('')),
  phone: z.string().max(30).trim()
    .transform(v => v.replace(/[^0-9+\-() ]/g, ''))  // only allow phone characters
    .optional().or(z.literal('')),
  vehicle_count: z.enum(['1-5', '6-20', '21+', '']).optional(),
  consent: z.boolean().refine(v => v === true, { message: 'Consent is required' }),
})

export const WaitlistSchema = BaseWaitlistSchema.superRefine((data, ctx) => {
  if (data.type === 'vendor') {
    if (!data.business_name || data.business_name.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Business name is required',
        path: ['business_name'],
      })
    }
    if (!data.phone || data.phone.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Phone number is required',
        path: ['phone'],
      })
    }
    if (!data.vehicle_count) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select an estimate',
        path: ['vehicle_count'],
      })
    }
  }
})

export type WaitlistInput = z.infer<typeof BaseWaitlistSchema>
