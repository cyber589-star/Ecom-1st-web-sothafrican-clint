'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, ArrowLeft, Package } from 'lucide-react'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { fetchProducts } from '@/data/products'
import { formatZAR } from '@/components/ui/PriceDisplay'

export default function WishlistPage() {
  const { items: wishlistItems, removeItem } = useWishlist()
  const { addItem } = useCart()
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([])

  useEffect(() => {
    if (wishlistItems.length > 0) fetchProducts().then(all => setWishlistProducts(all.filter((p: any) => wishlistItems.some((w: any) => w.id === p.id)))).catch(() => {})
    else setWishlistProducts([])
  }, [wishlistItems])

  if (wishlistItems.length === 0) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <Heart size={48} className="text-gray-200 mx-auto mb-4" />
          <h1 className="text-xl text-gray-900 mb-1">Your wishlist is empty</h1>
          <p className="text-gray-500 mb-6">Save items you love to your wishlist</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all text-sm">
            <ArrowLeft size={16} /> Browse Products
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-500 text-sm mt-0.5">{wishlistItems.length} saved item{wishlistItems.length !== 1 ? 's' : ''}</p>
          </div>
          <Link href="/products" className="text-sm text-gray-500 hover:text-amber-700 transition-colors">Browse Products</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-amber-200 hover:shadow-md transition-all">
              <Link href={`/products/${product.slug}`} className="block aspect-[4/5] overflow-hidden bg-gray-50">
                <Image src={product.images[0]} alt={product.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
              </Link>
              <div className="p-4 space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-gray-400">{product.category}</p>
                <Link href={`/products/${product.slug}`}><h3 className="text-sm font-semibold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-1">{product.name}</h3></Link>
                <p className="text-base font-bold text-gray-900">{formatZAR(product.price)}</p>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.images[0], slug: product.slug, quantity: 1 })}
                    className="flex-1 bg-gray-900 text-white hover:bg-gray-800 text-xs py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1">
                    <ShoppingBag size={12} /> Add to Cart
                  </button>
                  <button onClick={() => removeItem(product.id)} className="px-3 py-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all text-xs">Remove</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}

