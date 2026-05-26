'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, LogIn } from 'lucide-react'
import { useAdmin } from '@/context/AdminContext'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const { login } = useAdmin()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const success = await login(email, password)
    if (success) {
      toast.success('Welcome back, Admin!')
      router.push('/admin')
    } else {
      toast.error('Invalid credentials. Check ADMIN_EMAIL / ADMIN_PASSWORD in Vercel env vars.')
    }
    setBusy(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-sm mx-auto mb-3">P</div>
            <h1 className="text-base font-semibold text-gray-900">Admin Login</h1>
            <p className="text-xs text-gray-500 mt-1">Sign in to manage your store</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin Email"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-9 pr-9 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <button type="submit" disabled={busy}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white py-2.5 rounded-lg text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2">
              {busy ? 'Please wait...' : <><LogIn size={14} /> Sign In</>}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  )
}