'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ShoppingBag, DollarSign, Users as UsersIcon, Package, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, customers: 0 })
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const [pRes, oRes] = await Promise.all([fetch('/api/products'), fetch('/api/orders')])
      const products = await pRes.json()
      const orders = await oRes.json()
      const totalRevenue = orders.reduce((sum: number, o: any) => sum + (parseFloat((o.total || 'R0').replace('R','')) || 0), 0)
      const uniqueCustomers = new Set(orders.map((o: any) => o.email)).size
      setStats({ products: products.length, orders: orders.length, revenue: totalRevenue, customers: uniqueCustomers })
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleClearAll = async () => {
    if (!confirm('Delete all orders? This cannot be undone.')) return
    try {
      const { error } = await supabase.from('orders').update({ status: 'Deleted', paymentStatus: 'Cancelled' }).neq('id', 'none')
      if (error) throw error
      toast.success('All orders cleared')
      load()
    } catch { toast.error('Clear failed') }
  }

  const items = [
    { label: 'Total Revenue', value: `R${stats.revenue.toLocaleString()}`, icon: DollarSign, iconBg: 'bg-amber-100 text-amber-600' },
    { label: 'Total Orders', value: String(stats.orders), icon: ShoppingBag, iconBg: 'bg-blue-100 text-blue-600' },
    { label: 'Total Products', value: String(stats.products), icon: Package, iconBg: 'bg-emerald-100 text-emerald-600' },
    { label: 'Total Customers', value: String(stats.customers), icon: UsersIcon, iconBg: 'bg-purple-100 text-purple-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Analytics</h1>
          <p className="text-xs text-gray-500 mt-0.5">Track your store performance</p>
        </div>
        <button onClick={handleClearAll}
          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-xs font-semibold transition-all">
          <Trash2 size={13} /> Clear All Orders
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.iconBg}`}>
                  <item.icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
