'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Lock, Truck, CreditCard, ArrowLeft } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatZAR } from '@/components/ui/PriceDisplay'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', city: '', state: '', zip: '' })
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'paypal'>('cod')
  const [processing, setProcessing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const totalWithTax = total + total * 0.15

  const paypalEmail = typeof window !== 'undefined' ? localStorage.getItem('paypal_email') || 'makharietja@gmail.com' : 'makharietja@gmail.com'

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city) {
      toast.error('Please fill in all shipping fields'); return
    }
    setProcessing(true)
    try {
      const paymentMethodLabel = paymentMethod === 'paypal' ? 'PayPal' : 'Cash on Delivery'
      const orderData = {
        id: 'ORD-' + Date.now(), items: items.length, itemCount: items.reduce((s, i) => s + i.quantity, 0),
        customer: formData.name, customerName: formData.name, email: formData.email,
        total: formatZAR(totalWithTax), status: 'Pending',
        paymentMethod: paymentMethodLabel, paymentStatus: 'pending',
        shippingAddress: { address: formData.address, city: formData.city, state: formData.state, zip: formData.zip, phone: formData.phone },
        itemsDetail: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem('last_order', JSON.stringify(orderData))
      const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) })
      if (!res.ok) throw new Error('Order submission failed')
      clearCart()
      toast.success('Order placed successfully!')
      router.push('/order-success')
    } catch { toast.error('Order failed. Please try again.') } finally { setProcessing(false) }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white pt-20 sm:pt-24 pb-12 sm:pb-16 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-lg sm:text-xl text-gray-900 mb-2">Nothing to checkout</h1>
          <Link href="/products" className="text-amber-700 hover:text-amber-600 text-sm">Add items to your cart</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Link href="/cart" className="text-gray-500 hover:text-amber-700 transition-colors touch-target">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8">
          <div className="lg:col-span-3 space-y-5 sm:space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock size={16} className="text-amber-600" />
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange}
                  className="sm:col-span-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 min-h-[48px]" required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 min-h-[48px]" required />
                <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 min-h-[48px]" required />
                <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleInputChange}
                  className="sm:col-span-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 min-h-[48px]" required />
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 min-h-[48px]" required />
                <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 min-h-[48px]" />
                <input type="text" name="zip" placeholder="ZIP Code" value={formData.zip} onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 min-h-[48px]" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={16} className="text-amber-600" />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="text-amber-600 focus:ring-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} className="text-amber-600 focus:ring-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Pay via PayPal</p>
                    <p className="text-xs text-gray-500">Send payment manually to our PayPal email</p>
                  </div>
                </label>
                {paymentMethod === 'paypal' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">Send Payment To:</p>
                    <p className="text-sm sm:text-base font-bold text-blue-700 break-all">{paypalEmail}</p>
                    <p className="text-xs text-blue-600 mt-2">After sending payment, your order will be processed once confirmed.</p>
                  </div>
                )}
              </div>
            </div>

            <button onClick={handlePlaceOrder} disabled={processing}
              className="w-full bg-gray-900 text-white py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base min-h-[48px]">
              {paymentMethod === 'paypal' ? <CreditCard size={16} /> : <Truck size={16} />}
              {processing ? 'Processing...' : paymentMethod === 'paypal' ? `Place Order — ${formatZAR(totalWithTax)}` : `Place Order — Pay ${formatZAR(totalWithTax)} on Delivery`}
            </button>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6 space-y-4 sticky top-24">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Order Summary</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-white shrink-0">
                      <Image src={item.image} alt={item.name} width={48} height={48} className="object-contain w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-900 truncate">{item.name}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-700 font-semibold">{formatZAR(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="text-gray-900">{formatZAR(total)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-green-600">All over South Africa</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax</span><span className="text-gray-900">{formatZAR(total * 0.15)}</span></div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-base sm:text-lg font-bold"><span className="text-gray-900">Total</span><span className="text-amber-700">{formatZAR(totalWithTax)}</span></div>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500 justify-center pt-2">
                <Lock size={12} /> <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}