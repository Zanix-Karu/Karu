import { describe, it, expect, beforeEach } from 'vitest'
import { hashIp } from '@/lib/crypto'

describe('hashIp', () => {
  beforeEach(() => {
    process.env.IP_HASH_SALT = 'test-salt'
  })

  it('returns a string', async () => {
    const result = await hashIp('127.0.0.1')
    expect(typeof result).toBe('string')
  })

  it('returns a 64-character hex string (SHA-256)', async () => {
    const result = await hashIp('127.0.0.1')
    expect(result).toHaveLength(64)
    expect(result).toMatch(/^[0-9a-f]{64}$/)
  })

  it('is deterministic — same input produces same output', async () => {
    const a = await hashIp('192.168.1.1')
    const b = await hashIp('192.168.1.1')
    expect(a).toBe(b)
  })

  it('produces different outputs for different inputs', async () => {
    const a = await hashIp('192.168.1.1')
    const b = await hashIp('10.0.0.1')
    expect(a).not.toBe(b)
  })
})
