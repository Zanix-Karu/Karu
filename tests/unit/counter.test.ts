import { describe, it, expect } from 'vitest'
import { easeOutQuart } from '@/lib/easing'

describe('easeOutQuart', () => {
  it('returns 0 at t=0', () => {
    expect(easeOutQuart(0)).toBe(0)
  })

  it('returns 1 at t=1', () => {
    expect(easeOutQuart(1)).toBe(1)
  })

  it('returns a value between 0 and 1 at t=0.5', () => {
    const result = easeOutQuart(0.5)
    expect(result).toBeGreaterThan(0)
    expect(result).toBeLessThan(1)
  })

  it('returns a value greater than 0.5 at t=0.5 (ease-out means fast start)', () => {
    expect(easeOutQuart(0.5)).toBeGreaterThan(0.5)
  })

  it('returns approximately 0.9375 at t=0.5 (1 - (1-0.5)^4)', () => {
    expect(easeOutQuart(0.5)).toBeCloseTo(0.9375, 10)
  })
})
