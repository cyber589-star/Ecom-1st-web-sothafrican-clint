import { NextRequest, NextResponse } from 'next/server'
import { listOrders, createOrder, updateOrder, deleteOrder } from '@/lib/supabase-service'

export async function GET() {
  try {
    const orders = await listOrders()
    return NextResponse.json(orders, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  } catch (e: any) {
    const msg = (e?.message || e?.error?.message || 'Failed to fetch orders').slice(0, 500)
    console.error('GET /api/orders error:', msg)
    return NextResponse.json({ error: msg, detail: 'Check Supabase env vars on Vercel' }, { status: 500 })
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
    const msg = (e?.message || e?.error?.message || 'Failed to create order').slice(0, 500)
    console.error('POST /api/orders error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}