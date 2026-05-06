import { z } from 'zod'

const BaseWaitlistSchema = z.object({
  email: z.string().email('Please enter a valid email').max(254).toLowerCase().trim(),
  type: z.enum(['customer', 'vendor'], { required_error: 'Please select customer or vendor' }),
  city: z.enum(['douala', 'yaounde', 'other'], { required_error: 'Please select a city' }),
  locale: z.enum(['en', 'fr']).optional().default('en'),
  business_name: z.string().max(200).trim().optional().or(z.literal('')),
  business_email: z.string().email().max(254).toLowerCase().trim().optional().or(z.literal('')),
  phone: z.string().max(30).trim().optional().or(z.literal('')),
  vehicle_count: z.string().max(10).trim().optional().or(z.literal('')),
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
