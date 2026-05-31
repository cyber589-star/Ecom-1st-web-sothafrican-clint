import { NextRequest, NextResponse } from 'next/server'
import { listProducts, createProduct, getProductBySlug, searchProductsAPI } from '@/lib/supabase-service'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    if (slug) {
      const p = await getProductBySlug(slug)
      if (!p) return NextResponse.json({ error: 'Product not found', slug }, { status: 404 })
      return NextResponse.json(p)
    }
    const search = searchParams.get('search')
    if (search) {
      const results = await searchProductsAPI(search)
      return NextResponse.json(results)
    }
    const products = await listProducts()
    return NextResponse.json(products)
  } catch (e: any) {
    console.error('GET /api/products error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.name || !body.price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
    }
    body.price = parseFloat(body.price)
    if (isNaN(body.price) || body.price < 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }
    const product = await createProduct(body)
    return NextResponse.json(product, { status: 201 })
  } catch (e: any) {
    console.error('POST /api/products error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Failed to create product' }, { status: 500 })
  }
}