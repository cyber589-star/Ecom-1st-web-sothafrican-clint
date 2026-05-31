import { NextRequest, NextResponse } from 'next/server'
import { listProducts, createProduct, getProductBySlug, searchProductsAPI } from '@/lib/supabase-service'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    if (slug) {
      const p = await getProductBySlug(slug)
      if (!p) return NextResponse.json({ error: 'Product not found', slug }, { status: 404 })
      return NextResponse.json(p, { headers: { 'Cache-Control': 'no-store', 'CDN-Cache-Control': 'no-store' } })
    }
    const search = searchParams.get('search')
    if (search) {
      const results = await searchProductsAPI(search)
      return NextResponse.json(results, { headers: { 'Cache-Control': 'no-store', 'CDN-Cache-Control': 'no-store' } })
    }
    const products = await listProducts()
    return NextResponse.json(products, { headers: { 'Cache-Control': 'no-store, max-age=0', 'CDN-Cache-Control': 'no-store' } })
  } catch (e: any) {
    const msg = (e?.message || e?.error?.message || 'Failed to fetch products').slice(0, 500)
    console.error('GET /api/products error:', msg)
    return NextResponse.json({ error: msg, detail: 'Check Supabase env vars (NEXT_PUBLIC_SUPABASE_URL, anon key) on Vercel' }, { status: 500 })
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
    const msg = (e?.message || e?.error?.message || 'Failed to create product').slice(0, 500)
    console.error('POST /api/products error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}