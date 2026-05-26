'use client'

import { use, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { searchProductsAPI } from '@/data/products'
import ProductCard from '@/components/products/ProductCard'

export default function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = use(searchParams)
  const query = params.q || ''
  const [results, setResults] = useState<any[]>([])

  useEffect(() => { if (query) searchProductsAPI(query).then(setResults).catch(() => {}); else setResults([]) }, [query])

  return (
    <main className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Search Results</h1>
          {query ? (
            <p className="text-gray-500">{results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;</p>
          ) : (
            <p className="text-gray-500">Enter a search term to find products</p>
          )}
        </motion.div>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {results.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
          </div>
        ) : query ? (
          <div className="text-center py-20">
            <Search size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No products found for &quot;{query}&quot;</p>
          </div>
        ) : null}
      </div>
    </main>
  )
}
