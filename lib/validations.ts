import { z } from 'zod'

export const WaitlistSchema = z.object({
  email: z.string().email().max(254).toLowerCase().trim(),
  type: z.enum(['customer', 'vendor']),
  city: z.enum(['douala', 'yaounde', 'other']),
})

export type WaitlistInput = z.infer<typeof WaitlistSchema>
