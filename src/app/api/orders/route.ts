import { NextRequest, NextResponse } from 'next/server'
import { listOrders, createOrder } from '@/lib/supabase-service'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function GET() {
  try {
    const { data, error } = await getSupabaseServer().from('orders').select('*').neq('status', 'Deleted').order('createdAt', { ascending: false })
    if (error) throw error
    return NextResponse.json(data || [])
  }
  catch { return NextResponse.json([]) }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const order = {
      id: body.id || 'ORD-' + Date.now(),
      customer: body.customer || body.customerName || 'Customer',
      customerName: body.customerName || body.customer || '',
      email: body.email || '',
      items: body.items || 0,
      itemCount: body.itemCount || 0,
      total: body.total || 'R0',
      status: body.status || 'Pending',
      paymentMethod: body.paymentMethod || '',
      paymentStatus: body.paymentStatus || 'pending',
      itemsDetail: body.itemsDetail || [],
      shippingAddress: body.shippingAddress || {},
    }
    const result = await createOrder(order)
    return NextResponse.json(result, { status: 201 })
  } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
}
