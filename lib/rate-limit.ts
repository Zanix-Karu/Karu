/**
 * Rate limiter — in-memory implementation using a Map.
 *
 * NOTE: This is suitable for development and single-instance deployments only.
 * For production (multi-instance / serverless), replace with a distributed store:
 *   - Upstash Redis: https://upstash.com  (set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN)
 *   - Vercel KV:     https://vercel.com/docs/storage/vercel-kv
 */

const store = new Map<string, { count: number; resetAt: number }>()

/**
 * Check whether a given key is within its rate limit.
 *
 * @param key           Unique identifier for the caller (e.g. `"waitlist:${hashedIp}"`)
 * @param limit         Maximum number of requests allowed within the window
 * @param windowSeconds Length of the sliding window in seconds
 * @returns `{ success: true, retryAfter: 0 }` when the request is allowed,
 *          `{ success: false, retryAfter: N }` when the limit is exceeded (N = seconds until reset)
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ success: boolean; retryAfter: number }> {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
    return { success: true, retryAfter: 0 }
  }

  if (entry.count >= limit) {
    return { success: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count++
  return { success: true, retryAfter: 0 }
}
