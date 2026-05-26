import { createClient } from '@supabase/supabase-js'

let _supabase: any = null

export function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      console.warn('Supabase env vars not configured.')
      throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }
    _supabase = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  }
  return _supabase
}
