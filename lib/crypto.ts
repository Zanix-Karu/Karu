/**
 * Server-side only — IP hashing utility.
 * Uses the Web Crypto API (crypto.subtle) built into Node.js 18+.
 * No external dependencies.
 */

export async function hashIp(ip: string): Promise<string> {
  const salt = process.env.IP_HASH_SALT ?? ''
  const data = new TextEncoder().encode(salt + ip)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
