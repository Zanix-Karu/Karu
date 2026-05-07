import crypto from 'crypto'

function getKey(): Buffer {
  const hex = process.env.EMAIL_ENCRYPT_KEY ?? ''
  if (hex.length < 64) throw new Error('EMAIL_ENCRYPT_KEY must be 64 hex chars')
  return Buffer.from(hex.slice(0, 64), 'hex')
}

export function encryptBody(text: string): { encrypted: string; iv: string } {
  const key = getKey()
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return {
    encrypted: Buffer.concat([encrypted, tag]).toString('base64'),
    iv: iv.toString('hex'),
  }
}

export function decryptBody(encrypted: string, iv: string): string {
  const key = getKey()
  const data = Buffer.from(encrypted, 'base64')
  const tag = data.subarray(-16)
  const content = data.subarray(0, -16)
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'))
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(content), decipher.final()]).toString('utf8')
}
