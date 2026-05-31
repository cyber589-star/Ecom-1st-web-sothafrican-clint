import { NextRequest, NextResponse } from 'next/server'
import { getCategory, updateCategory, deleteCategory } from '@/lib/supabase-service'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cat = await getCategory(id)
    if (!cat) return NextResponse.json({ error: 'Category not found', id }, { status: 404 })
    return NextResponse.json(cat)
  } catch (e: any) {
    console.error('GET /api/categories/[id] error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Failed to fetch category' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'No update data provided' }, { status: 400 })
    }
    const cat = await updateCategory(id, body)
    return NextResponse.json(cat)
  } catch (e: any) {
    console.error('PUT /api/categories/[id] error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteCategory(id)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('DELETE /api/categories/[id] error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Failed to delete category' }, { status: 500 })
  }
}