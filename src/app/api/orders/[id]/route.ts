import { NextRequest, NextResponse } from 'next/server'
import { getOrder, updateOrder, deleteOrder } from '@/lib/supabase-service'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const order = await getOrder(id)
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    return NextResponse.json(order)
  } catch (e: any) {
    console.error('GET /api/orders/[id] error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const order = await updateOrder(id, body)
    return NextResponse.json(order)
  } catch (e: any) {
    console.error('PUT /api/orders/[id] error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Failed to update order' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteOrder(id)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('DELETE /api/orders/[id] error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Failed to delete order' }, { status: 500 })
  }
}