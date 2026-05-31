import { NextRequest, NextResponse } from 'next/server'
import { getProduct, updateProduct, deleteProduct } from '@/lib/supabase-service'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await getProduct(id)
    if (!product) return NextResponse.json({ error: 'Product not found', id }, { status: 404 })
    return NextResponse.json(product)
  } catch (e: any) {
    console.error('GET /api/products/[id] error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'No update data provided' }, { status: 400 })
    }
    const product = await updateProduct(id, body)
    return NextResponse.json(product)
  } catch (e: any) {
    console.error('PUT /api/products/[id] error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteProduct(id)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('DELETE /api/products/[id] error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Failed to delete product' }, { status: 500 })
  }
}