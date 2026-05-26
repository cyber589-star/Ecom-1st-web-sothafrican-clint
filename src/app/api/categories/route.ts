import { NextRequest, NextResponse } from 'next/server'
import { listCategories, createCategory } from '@/lib/supabase-service'

export async function GET() {
  try { const categories = await listCategories(); return NextResponse.json(categories) }
  catch { return NextResponse.json([]) }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const cat = await createCategory(body)
    return NextResponse.json(cat, { status: 201 })
  } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
}
