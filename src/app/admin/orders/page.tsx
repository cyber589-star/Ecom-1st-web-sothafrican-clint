'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, Package, Search, X, CreditCard, Truck, Trash2 } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed', 'Cancelled']
const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled']

export default function AdminOrdersPage() {
  const [orderList, setOrderList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const load = async () => {
    try {
      const { data, error } = await getSupabase().from('orders').select('*').order('createdAt', { ascending: false })
      if (!error && data) setOrderList(data)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  // Filter out soft-deleted orders, but allow searching for them
  const filtered = orderList.filter(o => {
    if ((o.status || '').toLowerCase() === 'deleted') return false
    if (!searchQuery) return true
    return (o.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this order?')) return
    try {
      const { error } = await getSupabase().from('orders').update({ status: 'Deleted', paymentStatus: 'Cancelled' }).eq('id', id)
      if (error) throw error
      toast.success('Order deleted')
      setSelectedOrder(null)
      load()
    } catch { toast.error('Delete failed') }
  }

  const updateOrderField = async (id: string, field: string, value: string) => {
    try {
      const { error } = await getSupabase().from('orders').update({ [field]: value }).eq('id', id)
      if (error) throw error
      toast.success(`${field} updated to ${value}`)
      load()
      setSelectedOrder((prev: any) => prev?.id === id ? { ...prev, [field]: value } : prev)
    } catch { toast.error('Update failed') }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Orders</h1>
        <p className="text-xs text-gray-500 mt-0.5">{orderList.filter(o => (o.status || '').toLowerCase() !== 'deleted').length} active orders</p>
      </div>

      {orderList.length > 0 && (
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..." className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400" />
        </div>
      )}

      <div className="rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left p-3 text-gray-500 font-medium">Order ID</th>
              <th className="text-left p-3 text-gray-500 font-medium">Customer</th>
              <th className="text-left p-3 text-gray-500 font-medium">Items</th>
              <th className="text-left p-3 text-gray-500 font-medium">Total</th>
              <th className="text-left p-3 text-gray-500 font-medium">Payment</th>
              <th className="text-left p-3 text-gray-500 font-medium">Status</th>
              <th className="text-left p-3 text-gray-500 font-medium">Date</th>
              <th className="text-right p-3 text-gray-500 font-medium">Action</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="p-12 text-center">
                  <Package size={28} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">{orderList.filter(o => (o.status || '').toLowerCase() !== 'deleted').length === 0 ? 'No orders yet' : 'No orders match your search'}</p>
                </td></tr>
              )}
              {filtered.map((order, i) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-gray-900 font-medium">{order.id}</td>
                  <td className="p-3"><p className="text-gray-900">{order.customer || 'Customer'}</p><p className="text-[10px] text-gray-500">{order.email}</p></td>
                  <td className="p-3 text-gray-500">{order.items || 0}</td>
                  <td className="p-3 text-amber-700 font-semibold">{order.total || 'R0'}</td>
                  <td className="p-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${(order.paymentStatus || '').toLowerCase() === 'paid' ? 'bg-emerald-100 text-emerald-700' : (order.paymentStatus || '').toLowerCase() === 'failed' ? 'bg-red-100 text-red-700' : (order.paymentStatus || '').toLowerCase() === 'cancelled' ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'}`}>
                      {order.paymentStatus || 'Pending'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${(order.status || '').toLowerCase() === 'completed' ? 'bg-emerald-100 text-emerald-700' : (order.status || '').toLowerCase() === 'shipped' ? 'bg-blue-100 text-blue-700' : (order.status || '').toLowerCase() === 'processing' ? 'bg-amber-100 text-amber-700' : (order.status || '').toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      <button onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded">
                        <Eye size={13} />
                      </button>
                      <button onClick={() => handleDelete(order.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedOrder(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg w-full my-8 shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-gray-900">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Order ID</p>
                  <p className="text-gray-900 font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Date</p>
                  <p className="text-gray-900">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Customer</p>
                  <p className="text-gray-900">{selectedOrder.customer || 'Customer'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="text-gray-900 break-all">{selectedOrder.email}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Shipping Address</p>
                <p className="text-gray-700 text-xs">
                  {selectedOrder.shippingAddress?.address || 'N/A'}, {selectedOrder.shippingAddress?.city || ''}, {selectedOrder.shippingAddress?.state || ''} {selectedOrder.shippingAddress?.zip || ''}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Order Items</p>
                {selectedOrder.itemsDetail && selectedOrder.itemsDetail.length > 0 ? (
                  <div className="space-y-1">
                    {selectedOrder.itemsDetail.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-xs text-gray-700">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="text-amber-700 font-semibold">R {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No item details</p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm font-bold mb-3">
                  <span className="text-gray-900">Total</span>
                  <span className="text-amber-700">{selectedOrder.total || 'R0'}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1.5">Payment Method</label>
                  <div className="flex items-center gap-2 text-sm">
                    {selectedOrder.paymentMethod === 'PayPal' ? <CreditCard size={14} className="text-blue-600" /> : <Truck size={14} className="text-gray-600" />}
                    <span className="text-gray-900">{selectedOrder.paymentMethod || 'N/A'}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1.5">Payment Status</label>
                  <select value={selectedOrder.paymentStatus || 'Pending'}
                    onChange={e => updateOrderField(selectedOrder.id, 'paymentStatus', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-amber-400">
                    {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1.5">Order Status</label>
                  <select value={selectedOrder.status || 'Pending'}
                    onChange={e => updateOrderField(selectedOrder.id, 'status', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-amber-400">
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <button onClick={() => handleDelete(selectedOrder.id)}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 py-2.5 rounded-lg text-xs font-semibold transition-all">
                  <Trash2 size={13} /> Delete Order
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
