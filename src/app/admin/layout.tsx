'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Tag, Truck,
  Search, Bell, Settings, LogOut, Percent, Sparkles,
} from 'lucide-react'
import { useAdmin } from '@/context/AdminContext'
import { AdminProvider } from '@/context/AdminContext'
import toast from 'react-hot-toast'

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: ShoppingBag },
  { label: 'Orders', href: '/admin/orders', icon: Tag },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Coupons', href: '/admin/coupons', icon: Percent },
  { label: 'Shipping', href: '/admin/shipping', icon: Truck },
  { label: 'SEO', href: '/admin/seo', icon: Search },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'Setup', href: '/admin/setup', icon: Sparkles },
]

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated && !pathname.includes('/admin/login')) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, pathname, router])

  if (pathname.includes('/admin/login')) {
    return <>{children}</>
  }

  if (!isAuthenticated) return null

  return <AdminDashboardShell logout={logout} pathname={pathname}>{children}</AdminDashboardShell>
}

function AdminDashboardShell({ children, logout, pathname }: { children: React.ReactNode; logout: () => void; pathname: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-gray-100">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-xs">P</div>
            <div>
              <span className="text-sm font-bold text-gray-900 tracking-wide">PRIDEPROMART</span>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="p-3 space-y-0.5">
          {sidebarLinks.map(link => {
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
            return (
              <Link key={link.href} href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-amber-50 text-amber-800 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}>
                <link.icon size={16} className={isActive ? 'text-amber-600' : 'text-gray-400'} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100 bg-white">
          <button onClick={() => { logout(); toast.success('Logged out') }}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all w-full">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <h1 className="text-sm font-semibold text-gray-900 hidden sm:block">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-gray-500 hover:text-amber-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50">
              View Store
            </Link>
            <button onClick={() => { logout(); toast.success('Logged out') }}
              className="text-xs text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 flex items-center gap-1.5">
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  )
}
