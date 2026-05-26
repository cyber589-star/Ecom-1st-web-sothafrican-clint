import { NextRequest, NextResponse } from 'next/server'
import { listProducts, createProduct, getProductBySlug, searchProductsAPI } from '@/lib/supabase-service'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    if (slug) { const p = await getProductBySlug(slug); return NextResponse.json(p ?? null, { status: p ? 200 : 404 }) }
    const search = searchParams.get('search')
    if (search) { const results = await searchProductsAPI(search); return NextResponse.json(results) }
    const products = await listProducts()
    return NextResponse.json(products)
  } catch { return NextResponse.json([]) }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const product = await createProduct(body)
    return NextResponse.json(product, { status: 201 })
  } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
}
