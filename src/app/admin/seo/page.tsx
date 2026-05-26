'use client'

import toast from 'react-hot-toast'

export default function AdminSEOPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">SEO Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">Optimize your store for search engines</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Meta Title</label>
          <input defaultValue="PrideProMart - Premium Luxury E-Commerce" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-amber-400" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Meta Description</label>
          <textarea defaultValue="Discover premium luxury products at PrideProMart. Shop curated collections of fashion, beauty, tech, and more." rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-amber-400" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Keywords</label>
          <input defaultValue="luxury, ecommerce, premium products, fashion, beauty, gadgets" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-amber-400" />
        </div>
        <button onClick={() => toast.success('SEO settings saved!')} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm">
          Save SEO Settings
        </button>
      </div>
    </div>
  )
}
