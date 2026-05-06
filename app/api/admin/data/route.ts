import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { scoreEntry } from '@/lib/sentiment'

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams

  let query = supabaseAdmin
    .from('waitlist_entries')
    .select('*')
    .order('created_at', { ascending: false })

  // Filters
  const type = p.get('type')
  if (type && type !== 'all') query = query.eq('type', type)

  const city = p.get('city')
  if (city && city !== 'all') query = query.eq('city', city)

  const locale = p.get('locale')
  if (locale && locale !== 'all') query = query.eq('locale', locale)

  const country = p.get('country')
  if (country && country !== 'all') query = query.eq('country', country)

  const q = p.get('q')
  if (q) query = query.or(`email.ilike.%${q}%,business_name.ilike.%${q}%`)

  const dateFrom = p.get('from')
  if (dateFrom) query = query.gte('created_at', dateFrom)

  const dateTo = p.get('to')
  if (dateTo) query = query.lte('created_at', dateTo + 'T23:59:59Z')

  const limit = parseInt(p.get('limit') ?? '200', 10)
  query = query.limit(limit)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Attach lead scores
  const enriched = (data ?? []).map(row => ({
    ...row,
    lead: scoreEntry(row),
  }))

  // Tier filter (post-score)
  const tier = p.get('tier')
  const filtered = tier && tier !== 'all'
    ? enriched.filter(r => r.lead.tier === tier)
    : enriched

  return NextResponse.json({ data: filtered, total: filtered.length })
}
