import { createClient } from '@supabase/supabase-js'

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || ''
}

function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
}

function getServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || ''
}

let _supabaseServer: any = null
export function getSupabaseServer() {
  if (!_supabaseServer) {
    if (!getSupabaseUrl() || !getSupabaseAnonKey()) {
      throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }
    _supabaseServer = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return _supabaseServer
}

let _supabaseAdmin: any = null
export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    if (!getSupabaseUrl() || !getServiceRoleKey()) {
      throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY — some write operations will fail')
    }
    _supabaseAdmin = createClient(getSupabaseUrl(), getServiceRoleKey(), {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return _supabaseAdmin
}