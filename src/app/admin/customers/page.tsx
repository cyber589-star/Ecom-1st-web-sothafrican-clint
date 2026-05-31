'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const load = async () => {
    try {
      const res = await fetch('/api/orders')
      if (res.ok) setOrders(await res.json())
    } catch {}
  }

  useEffect(() => { load() }, [])

  const handleClearAll = async () => {
    if (!confirm('Delete all orders? Customer data will reset to zero.')) return
    try {
      const res = await fetch('/api/orders')
      if (!res.ok) throw new Error('Failed to load orders')
      const allOrders = await res.json()
      for (const o of allOrders) {
        await fetch(`/api/orders/${o.id}`, { method: 'DELETE' })
      }
      toast.success('All customer data cleared')
      setOrders([])
    } catch { toast.error('Clear failed') }
  }

  const customerMap = new Map()
  orders.forEach((o: any) => {
    const email = o.email || 'unknown'
    if (!customerMap.has(email)) {
      customerMap.set(email, { name: o.customerName || 'Customer', email, orders: 0, total: 0, joined: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-' })
    }
    const c = customerMap.get(email)
    c.orders += o.itemCount || o.items || 1
    c.total += parseFloat((o.total || 'R0').replace('R','').replace(',','')) || 0
  })
  const customers = Array.from(customerMap.values())

  const filtered = customers.filter((c: any) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Customers</h1>
          <p className="text-xs text-gray-500 mt-0.5">{customers.length} customer{customers.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={handleClearAll}
          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-xs font-semibold transition-all">
          <Trash2 size={13} /> Clear All Customers
        </button>
      </div>

      {customers.length > 0 && (
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers..." className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400" />
        </div>
      )}
      <div className="rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left p-3 text-gray-500 font-medium">Name</th><th className="text-left p-3 text-gray-500 font-medium">Email</th>
            <th className="text-left p-3 text-gray-500 font-medium">Items</th><th className="text-left p-3 text-gray-500 font-medium">Spent</th>
            <th className="text-left p-3 text-gray-500 font-medium">Joined</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-12 text-center"><Users size={28} className="mx-auto mb-2 text-gray-300" /><p className="text-sm text-gray-500">{customers.length === 0 ? 'No customers yet' : 'No customers match your search'}</p></td></tr>
            )}
            {filtered.map((c: any, i: number) => (
              <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-3 text-gray-900 font-medium">{c.name}</td>
                <td className="p-3 text-gray-500">{c.email}</td>
                <td className="p-3 text-gray-500">{c.orders}</td>
                <td className="p-3 text-amber-700 font-semibold">R{c.total.toLocaleString()}</td>
                <td className="p-3 text-gray-500">{c.joined}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}