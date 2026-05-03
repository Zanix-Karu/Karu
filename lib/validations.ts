import { z } from 'zod'

export const WaitlistSchema = z.object({
  email: z.string().email().max(254).toLowerCase().trim(),
  type: z.enum(['customer', 'vendor']),
  city: z.enum(['douala', 'yaounde', 'other']),
  // Vendor-only fields (required when type is 'vendor')
  business_name: z.string().max(200).trim().optional(),
  phone: z.string().max(30).trim().optional(),
  vehicle_count: z.string().max(10).trim().optional(),
}).refine(
  (data) => {
    if (data.type === 'vendor') {
      return !!data.business_name && data.business_name.length >= 2
    }
    return true
  },
  { message: 'Business name is required', path: ['business_name'] }
).refine(
  (data) => {
    if (data.type === 'vendor') {
      return !!data.phone && data.phone.length >= 6
    }
    return true
  },
  { message: 'Phone number is required', path: ['phone'] }
).refine(
  (data) => {
    if (data.type === 'vendor') {
      return !!data.vehicle_count
    }
    return true
  },
  { message: 'Please select an estimate', path: ['vehicle_count'] }
)

export type WaitlistInput = z.infer<typeof WaitlistSchema>
