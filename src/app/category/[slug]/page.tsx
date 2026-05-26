'use client'

import { use, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { fetchProductsByCategory } from '@/data/products'
import ProductCard from '@/components/products/ProductCard'
import { Package } from 'lucide-react'

const categoryMap: Record<string, { name: string; image: string; description: string }> = {
  'phone-accessories': { name: 'Phone Accessories', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=1200&q=80', description: 'Premium phone cases, chargers, and accessories.' },
  'beauty-skincare': { name: 'Beauty & Skincare', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80', description: 'Luxury skincare and beauty essentials.' },
  'kitchenware': { name: 'Kitchenware', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80', description: 'Premium kitchen tools and cookware.' },
  'blankets-bedding': { name: 'Blankets & Bedding', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80', description: 'Luxury blankets and bedding sets.' },
  'smart-gadgets': { name: 'Smart Gadgets', image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=1200&q=80', description: 'Innovative smart devices and tech gadgets.' },
  'beauty-human-hair': { name: 'Beauty & Human Hair', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80', description: 'Premium wigs, extensions, and hair care.' },
  'fashion': { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80', description: 'Designer clothing and accessories.' },
  'car-accessories': { name: 'Car Accessories', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80', description: 'Premium car care and accessories.' },
  'perfumes': { name: 'Perfumes', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80', description: 'Luxury fragrances and colognes.' },
  'children-books-toys': { name: 'Children Books & Toys', image: '/images/categories/alexas_fotos-lego-674881_1920.jpg', description: 'Educational books and toys.' },
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [categoryProducts, setCategoryProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => { fetchProductsByCategory(slug).then(setCategoryProducts).catch(() => {}).finally(() => setLoading(false)) }, [slug])

  const cat = categoryMap[slug]

  if (!cat) {
    return <main className="min-h-screen bg-white pt-24 flex items-center justify-center"><div className="text-center"><h1 className="text-2xl text-gray-900 mb-4">Category Not Found</h1><a href="/products" className="text-amber-700">Back to Shop</a></div></main>
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="relative h-[35vh] min-h-[250px] overflow-hidden bg-gray-50">
        <Image src={cat.image} alt={cat.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs uppercase tracking-widest text-amber-600 mb-1">Category</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-1">{cat.name}</h1>
            <p className="text-gray-600 max-w-xl">{cat.description}</p>
            <p className="text-sm text-gray-400 mt-1">{categoryProducts.length} Products</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-6">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:outline-none focus:border-amber-400">
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categoryProducts.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
        </div>
        {categoryProducts.length === 0 && <div className="text-center py-20"><p className="text-gray-400">No products in this category yet.</p></div>}
      </div>
    </main>
  )
}
