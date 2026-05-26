'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatZAR } from '@/components/ui/PriceDisplay'

export default function CartPage() {
  const { items, total, itemCount, updateQuantity, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={48} className="text-gray-200 mx-auto mb-4" />
          <h1 className="text-xl text-gray-900 mb-1">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Add some luxury items to your cart</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all text-sm">
            <ArrowLeft size={16} />
            Continue Shopping
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
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 text-sm mt-0.5">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
          </div>
          <Link href="/products" className="text-sm text-gray-500 hover:text-amber-700 transition-colors flex items-center gap-1">
            <ArrowLeft size={14} />
            Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 items-center">
                <Link href={`/products/${item.slug}`} className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 shrink-10">
                  <Image src={item.image} alt={item.name} width={80} height={80} className="object-contain w-full h-full" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.slug}`}><h3 className="text-sm font-semibold text-gray-900 hover:text-amber-700 transition-colors truncate">{item.name}</h3></Link>
                  <p className="text-amber-700 font-bold mt-0.5">{formatZAR(item.price * item.quantity)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-50 text-gray-500"><Minus size={12} /></button>
                    <span className="px-3 py-1.5 text-sm text-gray-900 min-w-[2rem] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-50 text-gray-500"><Plus size={12} /></button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 space-y-4 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal ({itemCount} items)</span><span className="text-gray-900">{formatZAR(total)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-green-600">All over South Africa</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax</span><span className="text-gray-900">{formatZAR(total * 0.15)}</span></div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold"><span className="text-gray-900">Total</span><span className="text-amber-700">{formatZAR(total + total * 0.15)}</span></div>
              </div>
              <Link href="/checkout" className="block w-full text-center bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all">
                Proceed to Checkout
              </Link>
              <Link href="/products" className="block w-full text-center text-gray-500 py-3 text-sm hover:text-gray-900 transition-colors">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

