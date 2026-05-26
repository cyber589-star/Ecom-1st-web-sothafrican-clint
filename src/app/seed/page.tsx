'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  { id: 'phone-accessories', name: 'Phone Accessories', slug: 'phone-accessories', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80', description: 'Cases, chargers, screen protectors and more for your devices', productCount: 0 },
  { id: 'beauty-skincare', name: 'Beauty & Skincare', slug: 'beauty-skincare', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80', description: 'Premium skincare, makeup and beauty essentials', productCount: 0 },
  { id: 'kitchenware', name: 'Kitchenware', slug: 'kitchenware', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', description: 'High-quality kitchen tools, cookware and accessories', productCount: 0 },
  { id: 'blankets-bedding', name: 'Blankets & Bedding', slug: 'blankets-bedding', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', description: 'Luxury blankets, duvets and premium bedding sets', productCount: 0 },
  { id: 'smart-gadgets', name: 'Smart Gadgets', slug: 'smart-gadgets', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80', description: 'Innovative smart devices and tech accessories', productCount: 0 },
  { id: 'beauty-human-hair', name: 'Beauty & Human Hair', slug: 'beauty-human-hair', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', description: 'Premium human hair, wigs and hair care products', productCount: 0 },
  { id: 'fashion', name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80', description: 'Trendy clothing, footwear and accessories for every style', productCount: 0 },
  { id: 'car-accessories', name: 'Car Accessories', slug: 'car-accessories', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80', description: 'Auto accessories, interior care and vehicle upgrades', productCount: 0 },
  { id: 'perfumes', name: 'Perfumes', slug: 'perfumes', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80', description: 'Luxury fragrances and designer perfume collections', productCount: 0 },
  { id: 'children-books-toys', name: 'Children Books & Toys', slug: 'children-books-toys', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80', description: 'Educational books, fun toys and gifts for kids', productCount: 0 },
]

export default function SeedPage() {
  const [status, setStatus] = useState('Seeding categories...')

  useEffect(() => {
    (async () => {
      const { error: delErr } = await supabase.from('categories').delete().neq('id', 'none')
      if (delErr) { setStatus('Delete failed: ' + delErr.message); return }

      const { error: insErr } = await supabase.from('categories').insert(CATEGORIES)
      if (insErr) { setStatus('Insert failed: ' + insErr.message); return }

      setStatus(`✅ ${CATEGORIES.length} categories created! You can close this page.`)
    })()
  }, [])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-10 h-10 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-700 text-sm">{status}</p>
      </div>
    </div>
  )
}
