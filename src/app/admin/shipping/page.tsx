'use client'

import { Truck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminShippingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Shipping</h1>
        <p className="text-xs text-gray-500 mt-0.5">Manage shipping zones and rates</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <Truck size={20} className="text-amber-600" />
          <h2 className="text-sm font-semibold text-gray-900">Shipping Settings</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Free Shipping Threshold</label>
            <input type="number" defaultValue={50} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Standard Shipping Rate</label>
            <input type="number" defaultValue={9.99} step="0.01" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Express Shipping Rate</label>
            <input type="number" defaultValue={19.99} step="0.01" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Processing Time (days)</label>
            <input type="number" defaultValue={2} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-amber-400" />
          </div>
        </div>
        <button onClick={() => toast.success('Shipping settings saved!')} className="mt-5 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm">
          Save Shipping Settings
        </button>
      </div>
    </div>
  )
}
