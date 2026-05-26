'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { AdminProvider } from '@/context/AdminContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <AdminProvider>
      <CartProvider>
        <WishlistProvider>
          {!isAdmin && <Navbar />}
          {children}
          {!isAdmin && <Footer />}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#111827',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                fontSize: '14px',
                maxWidth: '90vw',
              },
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </AdminProvider>
  )
}