'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, Clock, Box } from 'lucide-react'

export default function AdminDashboard() {
  const [allProducts, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => { (async () => { try { const t = Date.now(); const [p, o] = await Promise.all([fetch('/api/products?_=' + t).then(r => r.json()), fetch('/api/orders?_=' + t).then(r => r.json())]); setProducts(Array.isArray(p) ? p : []); setOrders(Array.isArray(o) ? o : []) } catch {} })() }, [])

  const productCount = allProducts.length
  const orderCount = orders.length
  const revenue = orders.reduce((sum: number, o: any) => sum + (parseFloat((o.total || 'R0').replace('R','').replace(',','')) || 0), 0)
  const uniqueCustomers = new Set(orders.map((o: any) => o.email)).size

  const stats = [
    { label: 'Total Products', value: String(productCount), icon: Package, iconBg: 'bg-blue-100 text-blue-600' },
    { label: 'Total Orders', value: String(orderCount), icon: ShoppingBag, iconBg: 'bg-emerald-100 text-emerald-600' },
    { label: 'Customers', value: String(uniqueCustomers || orderCount), icon: Users, iconBg: 'bg-purple-100 text-purple-600' },
    { label: 'Revenue', value: `R${revenue.toLocaleString()}`, icon: DollarSign, iconBg: 'bg-amber-100 text-amber-700' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-0.5">Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="relative rounded-xl bg-white border border-gray-200 p-5 overflow-hidden hover:shadow-sm transition-shadow">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.iconBg}`}><s.icon size={18} /></div>
              </div>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent Orders</h2>
            {orders.length > 0 && <Link href="/admin/orders" className="text-xs text-amber-700 hover:text-amber-600">View all</Link>}
          </div>
          {orders.length === 0 ? (
            <div className="text-center py-10"><Clock size={32} className="mx-auto text-gray-300 mb-3" /><p className="text-sm text-gray-500">No orders yet</p></div>
          ) : (
            <div className="space-y-1">
              {orders.slice(0, 5).map((order: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center"><Box size={14} className="text-gray-400" /></div>
                    <div><p className="text-sm font-medium text-gray-900">{order.customer || 'Customer'}</p><p className="text-xs text-gray-500">{order.itemCount || order.items || 0} items</p></div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-amber-700">{order.total || 'R0'}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${(order.status || '').toLowerCase() === 'completed' ? 'bg-emerald-100 text-emerald-700' : (order.status || '').toLowerCase() === 'shipped' ? 'bg-blue-100 text-blue-700' : (order.status || '').toLowerCase() === 'processing' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{order.status || 'Pending'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/products" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-amber-300 transition-all group">
              <Package size={20} className="text-amber-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-gray-600 group-hover:text-gray-900">Products</span><span className="text-[10px] text-gray-400">{productCount} total</span>
            </Link>
            <Link href="/admin/categories" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-amber-300 transition-all group">
              <ShoppingBag size={20} className="text-amber-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-gray-600 group-hover:text-gray-900">Categories</span><span className="text-[10px] text-gray-400">Organize</span>
            </Link>
            <Link href="/admin/orders" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-amber-300 transition-all group">
              <ShoppingBag size={20} className="text-amber-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-gray-600 group-hover:text-gray-900">Orders</span><span className="text-[10px] text-gray-400">{orderCount} orders</span>
            </Link>
            <Link href="/admin/analytics" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-amber-300 transition-all group">
              <TrendingUp size={20} className="text-amber-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-gray-600 group-hover:text-gray-900">Analytics</span><span className="text-[10px] text-gray-400">Insights</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
