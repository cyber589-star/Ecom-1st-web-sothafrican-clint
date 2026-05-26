'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getSupabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

interface AdminContextType {
  isAuthenticated: boolean
  session: Session | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSupabase().auth.getSession().then((res: any) => {
      const session = res.data?.session ?? null
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } }: any = getSupabase().auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const { data, error } = await getSupabase().auth.signInWithPassword({ email, password })
    if (error) return false
    localStorage.setItem('admin_auth', 'true')
    setSession(data.session)
    return true
  }

  const logout = async () => {
    await getSupabase().auth.signOut()
    localStorage.removeItem('admin_auth')
    setSession(null)
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin" /></div>

  return (
    <AdminContext.Provider value={{ isAuthenticated: !!session, session, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
