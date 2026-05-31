import { NextRequest, NextResponse } from 'next/server'
import { listCategories, createCategory } from '@/lib/supabase-service'

export async function GET() {
  try {
    const categories = await listCategories()
    return NextResponse.json(categories, { headers: { 'Cache-Control': 'no-cache, max-age=10' } })
  } catch (e: any) {
    const msg = (e?.message || e?.error?.message || 'Failed to fetch categories').slice(0, 500)
    console.error('GET /api/categories error:', msg)
    return NextResponse.json({ error: msg, detail: 'Check Supabase env vars on Vercel' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }
    const cat = await createCategory(body)
    return NextResponse.json(cat, { status: 201 })
  } catch (e: any) {
    const msg = (e?.message || e?.error?.message || 'Failed to create category').slice(0, 500)
    console.error('POST /api/categories error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}