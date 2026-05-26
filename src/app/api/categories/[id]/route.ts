import { NextRequest, NextResponse } from 'next/server'
import { getCategory, updateCategory, deleteCategory } from '@/lib/supabase-service'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cat = await getCategory(id)
  if (!cat) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(cat)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const cat = await updateCategory(id, body)
    return NextResponse.json(cat)
  } catch { return NextResponse.json({ error: 'Not found' }, { status: 404 }) }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteCategory(id)
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Not found' }, { status: 404 }) }
}
