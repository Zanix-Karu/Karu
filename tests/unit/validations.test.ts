import { describe, it, expect } from 'vitest'
import { WaitlistSchema } from '@/lib/validations'

describe('WaitlistSchema', () => {
  it('accepts valid input', () => {
    const result = WaitlistSchema.safeParse({
      email: 'test@example.com',
      type: 'customer',
      city: 'douala',
    })
    expect(result.success).toBe(true)
  })

  it('normalises email to lowercase', () => {
    const result = WaitlistSchema.safeParse({
      email: 'TEST@EXAMPLE.COM',
      type: 'customer',
      city: 'douala',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('test@example.com')
    }
  })

  it('rejects an invalid email', () => {
    const result = WaitlistSchema.safeParse({
      email: 'not-an-email',
      type: 'customer',
      city: 'douala',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid type', () => {
    const result = WaitlistSchema.safeParse({
      email: 'test@example.com',
      type: 'admin',
      city: 'douala',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid city', () => {
    const result = WaitlistSchema.safeParse({
      email: 'test@example.com',
      type: 'customer',
      city: 'paris',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an email longer than 254 characters', () => {
    const longEmail = 'a'.repeat(245) + '@example.com' // 257 chars
    const result = WaitlistSchema.safeParse({
      email: longEmail,
      type: 'customer',
      city: 'douala',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing fields', () => {
    const result = WaitlistSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('accepts vendor type', () => {
    const result = WaitlistSchema.safeParse({
      email: 'vendor@example.com',
      type: 'vendor',
      city: 'yaounde',
    })
    expect(result.success).toBe(true)
  })

  it('accepts all valid city values', () => {
    for (const city of ['douala', 'yaounde', 'other'] as const) {
      const result = WaitlistSchema.safeParse({
        email: 'test@example.com',
        type: 'customer',
        city,
      })
      expect(result.success).toBe(true)
    }
  })
})
