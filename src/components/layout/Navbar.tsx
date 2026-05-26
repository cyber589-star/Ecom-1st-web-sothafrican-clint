'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { fetchCategories } from '@/data/categories'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryList, setCategoryList] = useState<any[]>([])
  const { itemCount } = useCart()
  const { items: wishlistItems } = useWishlist()

  useEffect(() => { fetchCategories().then(setCategoryList).catch(() => {}) }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/00a12c53-aa04-42b8-a0dc-a74e02c64e78_removalai_preview.png" alt="PrideProMart" width={120} height={70} className="object-contain h-12 w-auto"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              <span className="text-lg font-bold tracking-wide text-gray-900">PRIDEPROMART</span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {categoryList.slice(0, 5).map(cat => (
                <Link key={cat.id} href={`/category/${cat.slug}`}
                  className="text-sm text-gray-600 hover:text-amber-700 transition-colors font-medium">
                  {cat.name}
                </Link>
              ))}
              <Link href="/products"
                className="text-sm text-gray-600 hover:text-amber-700 transition-colors font-medium">
                Shop All
              </Link>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen(!searchOpen)}
                className="text-gray-500 hover:text-gray-900 p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                <Search size={18} />
              </button>
              <Link href="/wishlist"
                className="relative text-gray-500 hover:text-gray-900 p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                <Heart size={18} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-600 rounded-full text-[9px] flex items-center justify-center text-white font-bold">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link href="/cart"
                className="relative text-gray-500 hover:text-gray-900 p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-600 rounded-full text-[9px] flex items-center justify-center text-white font-bold">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden text-gray-500 hover:text-gray-900 p-2.5 rounded-lg hover:bg-gray-100">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border-t border-gray-100 bg-white"
            >
              <div className="max-w-3xl mx-auto px-4 py-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery.trim()) window.location.href = `/search?q=${encodeURIComponent(searchQuery)}` }}
                    placeholder="Search products..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400"
                    autoFocus />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white lg:hidden pt-16 lg:pt-20 shadow-lg">
            <div className="p-6 space-y-1 overflow-y-auto max-h-[calc(100vh-5rem)]">
              {categoryList.map(cat => (
                <Link key={cat.id} href={`/category/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="block text-gray-700 hover:text-amber-700 py-3.5 border-b border-gray-100 text-sm font-medium">
                  {cat.name}
                </Link>
              ))}
              <Link href="/products" onClick={() => setMobileOpen(false)}
                className="block text-amber-700 font-semibold py-3.5 text-sm">
                Shop All Products
              </Link>
              <Link href="/wishlist" onClick={() => setMobileOpen(false)}
                className="block text-gray-700 hover:text-amber-700 py-3.5 text-sm font-medium">
                Wishlist {wishlistItems.length > 0 && `(${wishlistItems.length})`}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
