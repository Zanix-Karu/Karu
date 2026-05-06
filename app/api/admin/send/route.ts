import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  const { subject, html, segment } = await request.json()

  if (!subject || !html) {
    return NextResponse.json({ error: 'Missing subject or body' }, { status: 400 })
  }

  // Build recipient list from Supabase based on segment
  let query = supabaseAdmin.from('waitlist_entries').select('email, locale')

  if (segment?.type && segment.type !== 'all') query = query.eq('type', segment.type)
  if (segment?.city && segment.city !== 'all') query = query.eq('city', segment.city)
  if (segment?.locale && segment.locale !== 'all') query = query.eq('locale', segment.locale)

  const { data: recipients, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const emails = (recipients ?? []).map(r => r.email).slice(0, 500)
  if (emails.length === 0) return NextResponse.json({ error: 'No recipients in segment' }, { status: 400 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  const results = []

  // Resend batch limit: 100 per call
  for (let i = 0; i < emails.length; i += 50) {
    const batch = emails.slice(i, i + 50)
    const { data, error: sendErr } = await resend.emails.send({
      from: 'Karu <noreply@getkaru.io>',
      to: batch,
      subject,
      html,
    })
    results.push({ batch: i / 50, sent: batch.length, id: data?.id, error: sendErr?.message })
  }

  return NextResponse.json({ results, total: emails.length })
}
