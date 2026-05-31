import { NextRequest, NextResponse } from 'next/server'
import { listOrders, createOrder, updateOrder, deleteOrder } from '@/lib/supabase-service'

export async function GET() {
  try {
    const orders = await listOrders()
    return NextResponse.json(orders)
  } catch (e: any) {
    console.error('GET /api/orders error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.customerName || !body.email) {
      return NextResponse.json({ error: 'Customer name and email are required' }, { status: 400 })
    }
    const order = await createOrder(body)
    return NextResponse.json(order, { status: 201 })
  } catch (e: any) {
    console.error('POST /api/orders error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Failed to create order' }, { status: 500 })
  }
}