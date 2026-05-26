'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'

export default function OrderCancelPage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-16 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <XCircle size={32} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Cancelled</h1>
        <p className="text-gray-500 mb-6">Your order was cancelled.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/checkout" className="inline-flex items-center justify-center bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all">Try Again</Link>
          <Link href="/products" className="inline-flex items-center justify-center border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:border-gray-300 transition-all">Continue Shopping</Link>
        </div>
      </motion.div>
    </main>
  )
}
