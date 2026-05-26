'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Trash2, Sparkles, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { name: 'Phone Accessories', slug: 'phone-accessories', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80', description: 'Cases, chargers, screen protectors and more for your devices' },
  { name: 'Beauty & Skincare', slug: 'beauty-skincare', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80', description: 'Premium skincare, makeup and beauty essentials' },
  { name: 'Kitchenware', slug: 'kitchenware', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', description: 'High-quality kitchen tools, cookware and accessories' },
  { name: 'Blankets & Bedding', slug: 'blankets-bedding', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', description: 'Luxury blankets, duvets and premium bedding sets' },
  { name: 'Smart Gadgets', slug: 'smart-gadgets', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80', description: 'Innovative smart devices and tech accessories' },
  { name: 'Beauty & Human Hair', slug: 'beauty-human-hair', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', description: 'Premium human hair, wigs and hair care products' },
  { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80', description: 'Trendy clothing, footwear and accessories for every style' },
  { name: 'Car Accessories', slug: 'car-accessories', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80', description: 'Auto accessories, interior care and vehicle upgrades' },
  { name: 'Perfumes', slug: 'perfumes', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80', description: 'Luxury fragrances and designer perfume collections' },
  { name: 'Children Books & Toys', slug: 'children-books-toys', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80', description: 'Educational books, fun toys and gifts for kids' },
]

type StepStatus = 'idle' | 'running' | 'done' | 'error'

export default function AdminSetupPage() {
  const [cleaning, setCleaning] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [steps, setSteps] = useState<Record<string, StepStatus>>({
    products: 'idle', orders: 'idle', categories: 'idle', seed: 'idle',
  })

  const updateStep = (key: string, status: StepStatus) => setSteps(prev => ({ ...prev, [key]: status }))

  const handleClean = async () => {
    setCleaning(true)
    setSteps({ products: 'running', orders: 'running', categories: 'running', seed: 'idle' })
    let ok = true

    for (const [key, table] of Object.entries({ products: 'products', orders: 'orders', categories: 'categories' })) {
      try {
        const { error } = await supabase.from(table).delete().neq('id', 'none')
        if (error) { updateStep(key, 'error'); ok = false }
        else updateStep(key, 'done')
      } catch { updateStep(key, 'error'); ok = false }
    }

    setCleaning(false)
    if (ok) toast.success('All data cleaned!')
    else toast.error('Some deletions failed')
  }

  const handleSeed = async () => {
    setSeeding(true)
    updateStep('seed', 'running')

    try {
      const { error: delErr } = await supabase.from('categories').delete().neq('id', 'none')
      if (delErr) throw delErr

      const cats = CATEGORIES.map(c => ({ ...c, id: c.slug, productCount: 0 }))
      const { error: insErr } = await supabase.from('categories').insert(cats)
      if (insErr) throw insErr

      updateStep('seed', 'done')
      toast.success(`${CATEGORIES.length} categories created!`)
    } catch { updateStep('seed', 'error'); toast.error('Seed failed') }
    finally { setSeeding(false) }
  }

  const stepIcon = (status: StepStatus) => {
    if (status === 'running') return <Loader size={14} className="animate-spin text-amber-600" />
    if (status === 'done') return <CheckCircle size={14} className="text-emerald-600" />
    if (status === 'error') return <AlertCircle size={14} className="text-red-600" />
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">System Setup</h1>
        <p className="text-xs text-gray-500 mt-0.5">Clean demo data and seed categories</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"><Trash2 size={18} className="text-red-600" /></div>
            <div><h2 className="text-sm font-semibold text-gray-900">Clean Data</h2><p className="text-xs text-gray-500">Remove all products, orders, and categories</p></div>
          </div>

          <div className="space-y-2 mb-4">
            {['products', 'orders', 'categories'].map(key => (
              <div key={key} className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                <span className="capitalize">{key}</span>
                {stepIcon(steps[key])}
              </div>
            ))}
          </div>

          <button onClick={handleClean} disabled={cleaning}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-2.5 rounded-lg text-xs font-semibold transition-all">
            {cleaning ? <Loader size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {cleaning ? 'Cleaning...' : 'Delete All Data'}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><Sparkles size={18} className="text-amber-600" /></div>
            <div><h2 className="text-sm font-semibold text-gray-900">Seed Categories</h2><p className="text-xs text-gray-500">Create 10 professional categories with images</p></div>
          </div>

          <div className="space-y-1 mb-4 max-h-40 overflow-y-auto">
            {CATEGORIES.map(c => (
              <div key={c.slug} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5">
                <div className="w-5 h-5 rounded overflow-hidden shrink-0"><img src={c.image} alt="" className="w-full h-full object-cover" /></div>
                <span>{c.name}</span>
              </div>
            ))}
          </div>

          <button onClick={handleSeed} disabled={seeding}
            className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white py-2.5 rounded-lg text-xs font-semibold transition-all">
            {seeding ? <Loader size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {seeding ? 'Creating...' : `Create ${CATEGORIES.length} Categories`}
          </button>

          {steps.seed === 'done' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-emerald-700 text-center">
              {CATEGORIES.length} categories created successfully!
            </motion.div>
          )}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs text-amber-800 font-semibold mb-1">⚡ Recommended Order:</p>
        <ol className="text-xs text-amber-700 space-y-0.5 list-decimal list-inside">
          <li>Click <strong>Delete All Data</strong> to remove demo content</li>
          <li>Click <strong>Create 10 Categories</strong> to seed professional categories</li>
          <li>Then add your products in the Products section</li>
        </ol>
      </div>
    </div>
  )
}
