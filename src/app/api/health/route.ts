import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '(not set)'
  const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasService = !!process.env.SUPABASE_SERVICE_ROLE_KEY

  let supabaseStatus = 'unknown'
  let supabaseDetail = ''

  if (url && hasAnon) {
    try {
      const res = await fetch(`${url}/rest/v1/`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
      })
      supabaseStatus = String(res.status)
      const ct = res.headers.get('content-type') || ''
      supabaseDetail = ct.includes('json') ? 'JSON OK' : `Unexpected: ${ct}`
      if (!ct.includes('json')) {
        const text = (await res.text()).slice(0, 200)
        supabaseDetail += ` — ${text}`
      }
    } catch (e: any) {
      supabaseStatus = 'error'
      supabaseDetail = e?.message || 'fetch failed'
    }
  } else {
    supabaseDetail = 'Missing URL or anon key'
  }

  return NextResponse.json({
    status: 'ok',
    supabase: { url, hasAnon, hasService, status: supabaseStatus, detail: supabaseDetail },
    adminEmail: process.env.ADMIN_EMAIL ? '(set)' : '(not set)',
    adminPassword: process.env.ADMIN_PASSWORD ? '(set)' : '(not set)',
    node: process.env.NODE_ENV,
  })
}