import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return NextResponse.json({ data: [], error: 'No API key' })

  try {
    const res = await fetch('https://api.resend.com/emails?limit=100', {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ data: [], error: text }, { status: res.status })
    }

    const json = await res.json()
    return NextResponse.json({ data: json.data ?? [] })
  } catch (err) {
    return NextResponse.json({ data: [], error: String(err) }, { status: 500 })
  }
}
