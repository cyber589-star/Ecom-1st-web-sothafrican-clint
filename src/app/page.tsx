'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Package } from 'lucide-react'
import HeroSection from '@/components/HeroSection'
import ProductCard from '@/components/products/ProductCard'
import { fetchFeaturedProducts, fetchNewArrivals, fetchProducts } from '@/data/products'
import { fetchCategories } from '@/data/categories'
import { Product, Category } from '@/types'

export default function HomePage() {
  const [allProducts, setProducts] = useState<Product[]>([])
  const [featured, setFeatured] = useState<Product[]>([])
  const [newItems, setNewArrivals] = useState<Product[]>([])
  const [categoryList, setCategoryList] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchProducts(), fetchFeaturedProducts(), fetchNewArrivals(), fetchCategories()])
      .then(([p, f, n, c]) => { setProducts(p); setFeatured(f); setNewArrivals(n); setCategoryList(c) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
        <p className="mt-4 text-sm tracking-widest text-amber-700 font-semibold">PRIDEPROMART</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <HeroSection />

      <section className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-10"
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-600 font-medium">Categories</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-1 sm:mb-2">
              Shop by <span className="text-amber-700">Category</span>
            </h2>
            <p className="text-gray-500 text-sm">Explore our diverse range of premium products</p>
          </motion.div>

          {categoryList.length === 0 ? (
            <div className="text-center py-12 col-span-full">
              <Package size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No categories yet.</p>
            </div>
          ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {categoryList.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/category/${cat.slug}`}
                  className="group block bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-amber-200 hover:shadow-md transition-all"
                >
                  <div className="aspect-square bg-gray-50">
                    <Image src={cat.image} alt={cat.name} width={300} height={300}
                      className="object-contain w-full h-full p-3 sm:p-4 group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-2.5 sm:p-3 text-center">
                    <p className="text-[11px] sm:text-xs font-semibold text-gray-900 group-hover:text-amber-700 transition-colors truncate">{cat.name}</p>
                    <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">{cat.productCount} items</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>

      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-6 sm:mb-8"
          >
            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-600 font-medium">Featured</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">Premium Picks</h2>
            </div>
            <Link href="/products" className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 hover:text-amber-700 transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </motion.div>

          {featured.length === 0 ? (
            <div className="text-center py-12 col-span-full">
              <Package size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No featured products yet.</p>
            </div>
          ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {featured.slice(0, 8).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          )}
        </div>
      </section>

      <section className="relative h-[300px] sm:h-[350px] lg:h-[400px] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80" alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="max-w-xl">
              <Sparkles className="text-amber-600 mb-3 sm:mb-4" size={20} />
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                Luxury Beyond <span className="text-amber-700">Compare</span>
              </h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
                Experience the finest selection of premium products curated for those who appreciate the exceptional.
              </p>
              <Link href="/products"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg group text-sm sm:text-base">
                Explore Collection
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6 sm:mb-8"
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-600 font-medium">New Arrivals</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">Just Landed</h2>
            <p className="text-gray-500 text-sm">The latest additions to our collection</p>
          </motion.div>

          {newItems.length === 0 ? (
            <div className="text-center py-12 col-span-full">
              <Package size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No products yet.</p>
            </div>
          ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {newItems.slice(0, 8).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link href="/products"
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all group text-sm">
              View All Products
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="pb-10 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              { icon: '✦', title: 'Premium Quality', desc: 'Handpicked luxury products' },
              { icon: '♛', title: 'Authentic Brands', desc: '100% genuine items' },
              { icon: '★', title: 'Elite Service', desc: 'Dedicated support team' },
              { icon: '♦', title: 'Secure Shopping', desc: 'Protected transactions' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 border border-gray-100 rounded-xl p-4 sm:p-6 text-center hover:border-amber-200 hover:bg-amber-50/30 transition-all"
              >
                <span className="text-xl sm:text-2xl text-amber-600 block mb-2 sm:mb-3">{item.icon}</span>
                <h3 className="text-gray-900 font-semibold text-sm sm:text-base mb-1">{item.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-10 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-amber-50 border border-amber-100 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center relative overflow-hidden"
          >
            <Sparkles className="text-amber-600 mx-auto mb-3 sm:mb-4" size={20} />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Join the PrideProMart Family
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-4 sm:mb-6 text-sm">
              Subscribe for exclusive offers, new arrivals, and luxury inspiration.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const input = (e.target as HTMLFormElement).querySelector('input')
                if (input?.value) {
                  const toast = (window as any).toast || { success: () => {} }
                  toast.success('Subscribed!')
                  input.value = ''
                }
              }}
              className="flex max-w-md mx-auto gap-2 sm:gap-3"
            >
              <input type="email" placeholder="Enter your email" required
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 min-h-[44px]" />
              <button type="submit"
                className="bg-gray-900 text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-all text-xs sm:text-sm min-h-[44px]">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

function ChevronRight(props: { size: number; className?: string }) {
  return (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}