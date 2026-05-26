'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const collections = [
  { name: 'Summer Essentials', slug: 'summer-essentials', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80', count: '24 Products' },
  { name: 'Gold Collection', slug: 'gold-collection', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80', count: '18 Products' },
  { name: 'Tech Premium', slug: 'tech-premium', image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800&q=80', count: '15 Products' },
  { name: 'Home Luxury', slug: 'home-luxury', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80', count: '12 Products' },
]

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Featured Collections</h1>
          <p className="text-gray-500">Curated selections of our finest products</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {collections.map((col, i) => (
            <motion.div key={col.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="group relative h-[350px] rounded-2xl overflow-hidden">
              <Image src={col.image} alt={col.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs text-amber-400 uppercase tracking-widest mb-1">Collection</p>
                <h3 className="text-2xl font-bold text-white mb-1">{col.name}</h3>
                <p className="text-sm text-gray-300 mb-4">{col.count}</p>
                <Link href="/products"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all group/link">
                  Explore <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
