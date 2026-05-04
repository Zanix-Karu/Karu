import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const revalidate = 60

export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from('waitlist_entries')
      .select('id', { count: 'exact', head: true })

    if (error) {
      console.error('[waitlist/count] DB error:', error.message)
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data: { count: count ?? 0 } },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    console.error('[waitlist/count] Unexpected error:', error instanceof Error ? error.message : 'unknown')
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    )
  }
}
