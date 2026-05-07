import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { encryptBody } from '@/lib/email-encrypt'

export async function POST(request: NextRequest) {
  const { subject, html, segment } = await request.json()

  if (!subject || !html) {
    return NextResponse.json({ error: 'Missing subject or body' }, { status: 400 })
  }

  // Build recipient list from Supabase based on segment
  let query = supabaseAdmin.from('waitlist_entries').select('email')

  if (segment?.type && segment.type !== 'all') query = query.eq('type', segment.type)
  if (segment?.city && segment.city !== 'all') query = query.eq('city', segment.city)
  if (segment?.locale && segment.locale !== 'all') query = query.eq('locale', segment.locale)

  const { data: recipients, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const emails = (recipients ?? []).map(r => r.email).slice(0, 500)
  if (emails.length === 0) return NextResponse.json({ error: 'No recipients in segment' }, { status: 400 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  let lastId: string | undefined

  // Send in BCC batches of 50
  const batchSize = 50
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize)
    const { data } = await resend.emails.send({
      from: 'Karu <noreply@getkaru.io>',
      to: batch,
      subject,
      html,
    })
    if (data?.id) lastId = data.id
  }

  // Encrypt HTML body before storing
  const { encrypted, iv } = encryptBody(html)

  await supabaseAdmin.from('admin_email_log').insert({
    subject,
    recipient_count: emails.length,
    segment,
    resend_id: lastId ?? null,
    email_type: 'broadcast',
    html_encrypted: encrypted,
    html_iv: iv,
  })

  return NextResponse.json({ ok: true, total: emails.length })
}
