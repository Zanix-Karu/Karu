import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Server-side only Supabase client using the service_role key.
 * This bypasses Row Level Security — use only in API routes, never in client code.
 *
 * Security measures:
 * - Lazy initialisation (no build-time env var errors)
 * - Session persistence disabled (stateless, no tokens stored)
 * - Auto-refresh disabled (no background network calls)
 * - Throws immediately if env vars are missing (fail-fast)
 */

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (_client) return _client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      '[supabase-admin] Missing environment variables. ' +
      `URL: ${url ? 'set' : 'MISSING'}, KEY: ${key ? 'set' : 'MISSING'}`
    )
  }

  _client = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    // Disable realtime (not needed for API routes)
    realtime: { params: { eventsPerSecond: 0 } },
  })

  return _client
}

export const supabaseAdmin = {
  from(table: string) {
    return getClient().from(table)
  },
  rpc(fn: string, args?: Record<string, unknown>) {
    return getClient().rpc(fn, args)
  },
}
