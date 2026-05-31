'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, Package, Search, X, CreditCard, Truck, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatZAR } from '@/components/ui/PriceDisplay'

export default function AdminOrdersPage() {
  const [orderList, setOrderList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const load = async () => {
    try {
      const res = await fetch('/api/orders?_=' + Date.now())
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || `HTTP ${res.status}`) }
      const data = await res.json()
      setOrderList(Array.isArray(data) ? data : [])
    } catch (e: any) {
      const m = (e?.message || 'network error').replace(/<[^>]+>/g, '').slice(0, 200)
      toast.error('Failed to load orders: ' + m)
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const filtered = orderList.filter(o =>
    o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setOrderList(prev => prev.filter(o => o.id !== id)); toast.success('Order deleted')
    } catch { toast.error('Delete failed') }
  }

  const updateField = async (id: string, field: string, value: any) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      if (!res.ok) throw new Error('Update failed')
      setOrderList(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o))
      toast.success('Order updated')
    } catch { toast.error('Update failed') }
  }

  const clearAllOrders = async () => {
    try {
      for (const o of orderList) {
        await fetch(`/api/orders/${o.id}`, { method: 'DELETE' })
      }
      setOrderList([]); toast.success('All orders cleared')
    } catch { toast.error('Failed to clear orders') }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Orders</h1>
          <p className="text-xs text-gray-500 mt-0.5">{orderList.length} order{orderList.length !== 1 ? 's' : ''}</p>
        </div>
        {orderList.length > 0 && <button onClick={clearAllOrders} className="flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-xs font-semibold transition-all"><Trash2 size={14} /> Clear All</button>}
      </div>

      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search orders..." className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400" />
      </div>

      <div className="rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left p-3 text-gray-500 font-medium">Customer</th>
                <th className="text-left p-3 text-gray-500 font-medium">Items</th>
                <th className="text-left p-3 text-gray-500 font-medium">Total</th>
                <th className="text-left p-3 text-gray-500 font-medium">Status</th>
                <th className="text-left p-3 text-gray-500 font-medium">Payment</th>
                <th className="text-right p-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-12 text-center">
                  <Package size={28} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">No orders found</p>
                </td></tr>
              )}
              {filtered.map((order, i) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    <div className="text-gray-900 font-medium truncate max-w-[160px]">{order.customerName}</div>
                    <div className="text-[10px] text-gray-400">{order.email}</div>
                  </td>
                  <td className="p-3 text-gray-500">{order.itemCount || order.items}</td>
                  <td className="p-3 text-amber-700 font-semibold">{order.total}</td>
                  <td className="p-3">
                    <select value={order.status} onChange={(e) => updateField(order.id, 'status', e.target.value)}
                      className={`text-[10px] px-2 py-1 rounded-lg border-0 font-medium ${
                        order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                        order.status === 'Deleted' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      order.paymentStatus === 'paid' || order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}>{order.paymentStatus || 'Pending'}</span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      <button onClick={() => setSelectedOrder(order)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded"><Eye size={13} /></button>
                      <button onClick={() => handleDelete(order.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-gray-200 p-5 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-gray-400">Order ID</p><p className="text-gray-900 font-medium break-all">{selectedOrder.id}</p></div>
                <div><p className="text-gray-400">Date</p><p className="text-gray-900">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p></div>
                <div><p className="text-gray-400">Customer</p><p className="text-gray-900">{selectedOrder.customerName}</p></div>
                <div><p className="text-gray-400">Email</p><p className="text-gray-900">{selectedOrder.email}</p></div>
                <div><p className="text-gray-400">Phone</p><p className="text-gray-900">{selectedOrder.phone || '-'}</p></div>
                <div><p className="text-gray-400">Payment</p><p className="text-gray-900">{selectedOrder.paymentMethod}</p></div>
              </div>
              <div className="border-t border-gray-100 pt-3"><p className="text-gray-400 mb-1">Shipping Address</p>
                <p className="text-gray-900">
                  {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state || ''} {selectedOrder.shippingAddress?.zip || ''}
                </p>
              </div>
              <div className="border-t border-gray-100 pt-3"><p className="text-gray-400 mb-2">Items</p>
                {(selectedOrder.itemsDetail || []).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between py-1.5"><span className="text-gray-900">{item.name} × {item.quantity}</span><span className="text-amber-700">{formatZAR(item.price * item.quantity)}</span></div>
                ))}
                <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between font-semibold"><span className="text-gray-900">Total</span><span className="text-amber-700">{selectedOrder.total}</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}