'use client'

import { motion } from 'framer-motion'
import { Bell, CheckCheck } from 'lucide-react'

const notifications = [
  { id: 1, title: 'New Order Received', message: 'Order #ORD-005 has been placed', time: '5 min ago', read: false },
  { id: 2, title: 'Low Stock Alert', message: 'Premium Leather Phone Case is running low', time: '1 hour ago', read: false },
  { id: 3, title: 'New Customer Registered', message: 'Alex Thompson just created an account', time: '3 hours ago', read: true },
  { id: 4, title: 'Payment Received', message: 'Payment for order #ORD-003 confirmed', time: '5 hours ago', read: true },
]

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Notifications</h1>
          <p className="text-xs text-gray-500 mt-0.5">Stay updated with store activities</p>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <CheckCheck size={14} /> Mark All Read
        </button>
      </div>

      <div className="space-y-2">
        {notifications.map((notif, i) => (
          <motion.div key={notif.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all ${!notif.read ? 'border-l-2 border-l-amber-500' : ''}`}>
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${notif.read ? 'bg-gray-100 text-gray-400' : 'bg-amber-50 text-amber-600'}`}>
                <Bell size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{notif.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap ml-3">{notif.time}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
