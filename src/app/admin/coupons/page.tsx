'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Percent } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([
    { id: '1', code: 'WELCOME20', discount: 20, type: 'percentage', minPurchase: 50, active: true, expires: '2026-12-31' },
    { id: '2', code: 'SAVE10', discount: 10, type: 'fixed', minPurchase: 30, active: true, expires: '2026-06-30' },
  ])

  const handleDelete = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id))
    toast.success('Coupon deleted')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Coupons</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage discount coupons</p>
        </div>
        <button className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm">
          <Plus size={14} /> Add Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {coupons.map((coupon, i) => (
          <motion.div key={coupon.id}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Percent size={18} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{coupon.code}</h3>
                  <p className="text-xs text-gray-500">
                    {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `R${coupon.discount} OFF`}
                    {' | '}Min: R{coupon.minPurchase}{' | '}Expires: {coupon.expires}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${coupon.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  {coupon.active ? 'Active' : 'Inactive'}
                </span>
                <button onClick={() => handleDelete(coupon.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"><Trash2 size={13} /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
