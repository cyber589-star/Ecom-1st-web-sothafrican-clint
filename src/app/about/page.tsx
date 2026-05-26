'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Shield, Award, Truck, Headphones } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 sm:mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">About PrideProMart</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">Your premier destination for luxury products across multiple categories.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative h-[250px] sm:h-[350px] rounded-xl sm:rounded-2xl overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80" alt="About" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Our Story</h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              PrideProMart was founded with a vision to bring the finest products from around the world to discerning customers. We curate every item with care, ensuring only the highest quality makes it to your doorstep.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              From fashion to technology, beauty to home essentials, we partner with premium brands and artisans to offer you an unparalleled shopping experience.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            { icon: Shield, title: 'Quality Guaranteed', desc: 'Every product meets our premium standards' },
            { icon: Award, title: 'Authentic Products', desc: '100% genuine items from trusted brands' },
            { icon: Truck, title: 'Shipping across SA', desc: 'Delivery available all over South Africa' },
            { icon: Headphones, title: '24/7 Support', desc: 'Dedicated customer service team' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-gray-50 border border-gray-100 rounded-xl p-4 sm:p-6 text-center hover:border-amber-200 transition-all">
              <item.icon size={22} className="text-amber-600 mx-auto mb-2 sm:mb-3" />
              <h3 className="text-gray-900 font-semibold text-sm sm:text-base mb-0.5 sm:mb-1">{item.title}</h3>
              <p className="text-gray-500 text-xs sm:text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}