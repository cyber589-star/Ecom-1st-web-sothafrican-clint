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

  const sorted = [...categoryProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'rating': return b.rating - a.rating
      default: return b.featured ? 1 : -1
    }
  })

  const cat = categoryMap[slug]

  if (!cat) {
    return <main className="min-h-screen bg-white pt-20 sm:pt-24 flex items-center justify-center"><div className="text-center px-4"><h1 className="text-xl sm:text-2xl text-gray-900 mb-4">Category Not Found</h1><a href="/products" className="text-amber-700">Back to Shop</a></div></main>
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="relative h-[25vh] sm:h-[30vh] lg:h-[35vh] min-h-[180px] sm:min-h-[250px] overflow-hidden bg-gray-50">
        <Image src={cat.image} alt={cat.name} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[9px] sm:text-xs uppercase tracking-widest text-amber-600 mb-0.5 sm:mb-1">Category</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-0.5 sm:mb-1">{cat.name}</h1>
            <p className="text-gray-600 max-w-xl text-xs sm:text-sm sm:text-base">{cat.description}</p>
            <p className="text-[10px] sm:text-sm text-gray-400 mt-0.5 sm:mt-1">{categoryProducts.length} Products</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex justify-end mb-6">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:outline-none focus:border-amber-400 min-h-[44px] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%3E%3Cpath%20d%3D%22M3%204.5l3%203%203-3%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center] pr-8">
            <option value="featured">Sort: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {sorted.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
        </div>
        {sorted.length === 0 && <div className="text-center py-20"><p className="text-gray-400">No products in this category yet.</p></div>}
      </div>
    </main>
  )
}