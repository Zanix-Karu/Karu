// Guard: throw if imported client-side
if (typeof window !== 'undefined') {
  throw new Error('supabase-admin must not be imported client-side')
}

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazily initialized to avoid build-time errors when env vars are not set
let _client: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error('Missing Supabase environment variables')
    }
    _client = createClient(url, key)
  }
  return _client
}

// Convenience alias — same lazy pattern
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
