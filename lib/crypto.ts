/**
 * Server-side only — cryptographic utilities.
 * Uses the Web Crypto API (crypto.subtle) built into Node.js 18+.
 * No external dependencies.
 */

/**
 * Hash an IP address with HMAC-SHA256 using a secret salt.
 * This is a one-way operation — the original IP cannot be recovered.
 * Even if the database is compromised, IPs remain protected.
 */
export async function hashIp(ip: string): Promise<string> {
  const salt = process.env.IP_HASH_SALT
  if (!salt) {
    // Fail-closed in production: unsalted SHA-256 over 4-billion IPv4 space is
    // rainbow-tableable. Refuse to produce a false sense of protection.
    if (process.env.NODE_ENV === 'production') {
      throw new Error('IP_HASH_SALT must be set in production — unsalted hashes are reversible')
    }
    // Dev-only fallback to keep local development unblocked
    const data = new TextEncoder().encode('karu-ip-v1:' + ip)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    return bufferToHex(hashBuffer)
  }

  // HMAC-SHA256 with secret salt — cryptographically strong
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(salt),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ip))
  return bufferToHex(signature)
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
