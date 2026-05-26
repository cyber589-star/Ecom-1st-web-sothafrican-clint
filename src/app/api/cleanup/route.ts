import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  const results: Record<string, string> = {}

  for (const table of ['products', 'orders', 'categories']) {
    try {
      const { error } = await getSupabaseAdmin().from(table).delete().neq('id', 'none')
      results[table] = error ? `Error: ${error.message}` : 'Cleared'
    } catch (e: any) {
      results[table] = `Error: ${e.message}`
    }
  }

  return NextResponse.json(results)
}