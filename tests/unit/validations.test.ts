import { describe, it, expect } from 'vitest'
import { WaitlistSchema } from '@/lib/validations'

const validCustomer = {
  email: 'test@example.com',
  type: 'customer',
  city: 'douala',
  consent: true,
}

describe('WaitlistSchema', () => {
  it('accepts valid input', () => {
    const result = WaitlistSchema.safeParse(validCustomer)
    expect(result.success).toBe(true)
  })

  it('normalises email to lowercase', () => {
    const result = WaitlistSchema.safeParse({
      ...validCustomer,
      email: 'TEST@EXAMPLE.COM',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('test@example.com')
    }
  })

  it('rejects an invalid email', () => {
    const result = WaitlistSchema.safeParse({
      ...validCustomer,
      email: 'not-an-email',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid type', () => {
    const result = WaitlistSchema.safeParse({
      ...validCustomer,
      type: 'admin',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid city', () => {
    const result = WaitlistSchema.safeParse({
      ...validCustomer,
      city: 'paris',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an email longer than 254 characters', () => {
    const longEmail = 'a'.repeat(245) + '@example.com' // 257 chars
    const result = WaitlistSchema.safeParse({
      ...validCustomer,
      email: longEmail,
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing fields', () => {
    const result = WaitlistSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects missing consent (Law 2024/017)', () => {
    const { consent: _consent, ...withoutConsent } = validCustomer
    const result = WaitlistSchema.safeParse(withoutConsent)
    expect(result.success).toBe(false)
  })

  it('rejects consent: false', () => {
    const result = WaitlistSchema.safeParse({
      ...validCustomer,
      consent: false,
    })
    expect(result.success).toBe(false)
  })

  it('accepts vendor type with required vendor fields', () => {
    const result = WaitlistSchema.safeParse({
      email: 'vendor@example.com',
      type: 'vendor',
      city: 'yaounde',
      consent: true,
      business_name: 'JP Auto',
      phone: '+237655123456',
      vehicle_count: '1-5',
    })
    expect(result.success).toBe(true)
  })

  it('rejects vendor without business fields', () => {
    const result = WaitlistSchema.safeParse({
      email: 'vendor@example.com',
      type: 'vendor',
      city: 'yaounde',
      consent: true,
    })
    expect(result.success).toBe(false)
  })

  it('accepts all valid city values', () => {
    for (const city of ['douala', 'yaounde', 'other'] as const) {
      const result = WaitlistSchema.safeParse({
        ...validCustomer,
        city,
      })
      expect(result.success).toBe(true)
    }
  })
})
