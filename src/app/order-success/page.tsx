'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, ShoppingBag, CreditCard } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem('last_order')
    if (saved) setOrder(JSON.parse(saved))
  }, [])

  const isPayPal = order?.paymentMethod === 'PayPal'
  const paypalEmail = localStorage.getItem('paypal_email') || 'makharietja@gmail.com'

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Successful!</h1>
        <p className="text-gray-500 mb-1">Thank you for your purchase.</p>
        {order && <p className="text-sm text-gray-400 mb-4">Order ID: {order.id}</p>}

        {isPayPal && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={16} className="text-blue-700" />
              <p className="text-sm font-semibold text-blue-900">PayPal Payment Instructions</p>
            </div>
            <p className="text-xs text-blue-700 mb-1">Send payment to:</p>
            <p className="text-sm font-bold text-blue-800 break-all mb-2">{paypalEmail}</p>
            <p className="text-xs text-blue-600">Your order will be processed once payment is confirmed. Please include your Order ID ({order?.id}) in the payment note.</p>
          </div>
        )}

        {!isPayPal && (
          <p className="text-sm text-gray-500 mb-6">Pay on delivery — no upfront payment needed.</p>
        )}

        <Link href="/products" className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all">
          <ShoppingBag size={18} /> Continue Shopping
        </Link>
      </motion.div>
    </main>
  )
}
