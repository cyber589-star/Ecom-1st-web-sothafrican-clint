import { fetchWithTimeout } from '@/lib/fetch-with-timeout'

async function api(url: string) {
  const sep = url.includes('?') ? '&' : '?'
  const res = await fetchWithTimeout(`${url}${sep}_=${Date.now()}`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function fetchProducts(): Promise<any[]> {
  return api('/api/products')
}

export async function fetchProductBySlug(slug: string): Promise<any | null> {
  try {
    const res = await fetchWithTimeout(`/api/products?slug=${encodeURIComponent(slug)}&_=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

export async function searchProductsAPI(query: string): Promise<any[]> {
  return api(`/api/products?search=${encodeURIComponent(query)}`)
}

export async function fetchFeaturedProducts(): Promise<any[]> {
  const all = await api('/api/products')
  return all.filter((p: any) => p.featured)
}

export async function fetchNewArrivals(): Promise<any[]> {
  const all = await api('/api/products')
  return all.slice(0, 20)
}

export async function fetchProductsByCategory(slug: string): Promise<any[]> {
  const all = await api('/api/products')
  return all.filter((p: any) => p.categorySlug === slug)
}

export const getProducts = (): any[] => []
export const getProductBySlug = (slug: string): any | undefined => undefined
export const searchProducts = (query: string): any[] => []
export const getFeaturedProducts = (): any[] => []
export const getNewArrivals = (): any[] => []
