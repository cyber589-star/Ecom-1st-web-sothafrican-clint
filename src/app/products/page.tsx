'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X, Package } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import { fetchProducts } from '@/data/products'

const staticCategories = [
  { id: 'phone-accessories', name: 'Phone Accessories' },
  { id: 'beauty-skincare', name: 'Beauty & Skincare' },
  { id: 'kitchenware', name: 'Kitchenware' },
  { id: 'blankets-bedding', name: 'Blankets & Bedding' },
  { id: 'smart-gadgets', name: 'Smart Gadgets' },
  { id: 'beauty-human-hair', name: 'Beauty & Human Hair' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'car-accessories', name: 'Car Accessories' },
  { id: 'perfumes', name: 'Perfumes' },
  { id: 'children-books-toys', name: 'Children Books & Toys' },
]

export default function ShopPage() {
  const [allProducts, setProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => { fetchProducts().then(setProducts).catch(() => {}) }, [])

  useEffect(() => {
    document.body.style.overflow = showFilters ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showFilters])

  const filtered = allProducts.filter((p: any) => {
    if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some((t: string) => t.toLowerCase().includes(q))
    }
    return true
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'rating': return b.rating - a.rating
      case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default: return b.featured ? 1 : -1
    }
  })

  return (
    <main className="min-h-screen bg-white pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Explore <span className="text-amber-700">Collection</span></h1>
          <p className="text-gray-500 text-sm">Discover our curated selection of premium products</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          <div className="lg:w-60 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 sm:py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400" />
              </div>

              <div className="flex items-center gap-2 lg:hidden">
                <button onClick={() => setShowFilters(!showFilters)}
                  className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-xl py-2.5 transition-colors min-h-[44px]">
                  <SlidersHorizontal size={16} />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                <div className="relative">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl py-2.5 sm:py-3 px-3 text-sm text-gray-900 focus:outline-none focus:border-amber-400 min-h-[44px] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%3E%3Cpath%20d%3D%22M3%204.5l3%203%203-3%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center] pr-8">
                    <option value="featured">Sort</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>

              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed inset-0 z-50 bg-black/30 lg:hidden"
                  onClick={() => setShowFilters(false)}
                >
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl rounded-l-2xl"
                  >
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
                      <button onClick={() => setShowFilters(false)} className="touch-target text-gray-500 hover:text-gray-900">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-5rem)]">
                      <div>
                        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Categories</h3>
                        <div className="space-y-1">
                          <button onClick={() => { setSelectedCategory('all'); setShowFilters(false) }}
                            className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                              selectedCategory === 'all' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}>All Products</button>
                          {staticCategories.map(cat => (
                            <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setShowFilters(false) }}
                              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                selectedCategory === cat.id ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                              }`}>{cat.name}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Sort By</h3>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-3 text-sm text-gray-900 focus:outline-none focus:border-amber-400">
                          <option value="featured">Featured</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="rating">Highest Rated</option>
                          <option value="newest">Newest First</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              <div className="hidden lg:block space-y-4">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Categories</h3>
                  <div className="space-y-1">
                    <button onClick={() => setSelectedCategory('all')}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === 'all' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}>All Products</button>
                    {staticCategories.map(cat => (
                      <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat.id ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}>{cat.name}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Sort By</h3>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-3 text-sm text-gray-900 focus:outline-none focus:border-amber-400">
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {searchQuery && (
              <p className="text-sm text-gray-500 mb-4">{filtered.length} result{filtered.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-20"><p className="text-gray-400">No products found.</p></div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}