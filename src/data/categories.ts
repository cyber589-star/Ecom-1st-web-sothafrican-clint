import { fetchWithTimeout } from '@/lib/fetch-with-timeout'

export async function fetchCategories(): Promise<any[]> {
  try {
    const res = await fetchWithTimeout('/api/categories')
    if (!res.ok) return []
    return await res.json()
  } catch { return [] }
}

export const getCategories = (): any[] => []
export const saveCategories = (items: any[]) => {}
