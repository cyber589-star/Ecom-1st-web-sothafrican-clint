import { createClient } from '@supabase/supabase-js'

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL')
  return url
}

function getSupabaseAnonKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY')
  return key
}

function getServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY')
  return key
}

let _supabaseServer: any = null
export function getSupabaseServer() {
  if (!_supabaseServer) {
    _supabaseServer = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return _supabaseServer
}

let _supabaseAdmin: any = null
export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(getSupabaseUrl(), getServiceRoleKey(), {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return _supabaseAdmin
}
