'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [paypalEmail, setPaypalEmail] = useState('')
  const [storeName, setStoreName] = useState('PrideProMart')
  const [storeEmail, setStoreEmail] = useState('admin@pridepromart.com')

  useEffect(() => {
    const saved = localStorage.getItem('paypal_email')
    if (saved) setPaypalEmail(saved)
  }, [])

  const handleSave = () => {
    localStorage.setItem('paypal_email', paypalEmail)
    toast.success('Settings saved!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">Configure your store settings</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">General Settings</h2>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Store Name</label>
            <input value={storeName} onChange={e => setStoreName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Store Email</label>
            <input value={storeEmail} onChange={e => setStoreEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Currency</label>
            <select defaultValue="ZAR"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-amber-400">
              <option>ZAR (R)</option>
            </select>
          </div>
          <button onClick={handleSave}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm">
            Save Settings
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">Payment Methods</h2>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
              Enable Cash on Delivery
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
              Enable PayPal (Manual)
            </label>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">PayPal Email</label>
            <input type="email" value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)}
              placeholder="your-paypal@email.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400" />
            <p className="text-[10px] text-gray-400 mt-1">Customers will be asked to send payment to this email</p>
          </div>
        </div>
      </div>
    </div>
  )
}
