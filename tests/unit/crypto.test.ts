import { describe, it, expect, beforeEach, vi } from 'vitest'
import { hashIp } from '@/lib/crypto'

describe('hashIp', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
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

  it('throws in production when IP_HASH_SALT is unset (fail-closed)', async () => {
    delete process.env.IP_HASH_SALT
    vi.stubEnv('NODE_ENV', 'production')
    await expect(hashIp('127.0.0.1')).rejects.toThrow('IP_HASH_SALT must be set')
  })

  it('allows unsalted fallback in development when IP_HASH_SALT is unset', async () => {
    delete process.env.IP_HASH_SALT
    vi.stubEnv('NODE_ENV', 'test')
    const result = await hashIp('127.0.0.1')
    expect(result).toHaveLength(64)
    expect(result).toMatch(/^[0-9a-f]{64}$/)
  })
})
