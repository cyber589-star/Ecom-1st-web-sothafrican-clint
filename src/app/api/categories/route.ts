import { NextRequest, NextResponse } from 'next/server'
import { listCategories, createCategory } from '@/lib/supabase-service'

export async function GET() {
  try {
    const categories = await listCategories()
    return NextResponse.json(categories)
  } catch (e: any) {
    console.error('GET /api/categories error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Failed to fetch categories' }, { status: 500 })
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
    console.error('POST /api/categories error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Failed to create category' }, { status: 500 })
  }
}