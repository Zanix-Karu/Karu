import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { encryptBody } from '@/lib/email-encrypt'
import { wrapInKaruTemplate } from '@/lib/email-template'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { subject, html, segment, mode, to } = await request.json()

  if (!subject || !html) {
    return NextResponse.json({ error: 'Missing subject or body' }, { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  // Wrap content in Karu branded template
  const fullHtml = wrapInKaruTemplate(html, subject)

  // ── Single email mode ─────────────────────────────────────────────────────
  if (mode === 'single') {
    if (!to || typeof to !== 'string') {
      return NextResponse.json({ error: 'Missing recipient email' }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: 'Karu <noreply@getkaru.io>',
      to,
      subject,
      html: fullHtml,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log single email
    const { encrypted, iv } = encryptBody(fullHtml)
    await supabaseAdmin.from('admin_email_log').insert({
      subject,
      recipient_count: 1,
      segment: null,
      resend_id: data?.id ?? null,
      email_type: 'single',
      html_encrypted: encrypted,
      html_iv: iv,
    })

    return NextResponse.json({ ok: true, total: 1, resend_id: data?.id })
  }

  // ── Broadcast mode (default) ──────────────────────────────────────────────
  // Exclude anyone who has exercised their marketing objection (Law 2024/017)
  let query = supabaseAdmin.from('waitlist_entries').select('email').neq('marketing_opt_out', true)

  if (segment?.type && segment.type !== 'all') query = query.eq('type', segment.type)
  if (segment?.city && segment.city !== 'all') query = query.eq('city', segment.city)
  if (segment?.locale && segment.locale !== 'all') query = query.eq('locale', segment.locale)

  const { data: recipients, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const emails = (recipients ?? []).map(r => r.email).slice(0, 500)
  if (emails.length === 0) return NextResponse.json({ error: 'No recipients in segment' }, { status: 400 })

  let lastId: string | undefined

  // Send in batches of 50
  const batchSize = 50
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize)
    const { data } = await resend.emails.send({
      from: 'Karu <noreply@getkaru.io>',
      to: batch,
      subject,
      html: fullHtml,
    })
    if (data?.id) lastId = data.id
  }

  // Log broadcast
  const { encrypted, iv } = encryptBody(fullHtml)
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
