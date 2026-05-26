import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[90vh] bg-white pt-14 sm:pt-16 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 items-center min-h-[50vh] sm:min-h-[60vh] lg:min-h-[80vh]">
          <div className="order-2 lg:order-1 pt-4 sm:pt-8 lg:pt-0">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-600" />
              <span className="text-amber-800 text-[10px] sm:text-xs tracking-widest uppercase font-semibold">Premium Collection 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] sm:leading-[1.05] mb-3 sm:mb-5 tracking-tight">
              Premium Products
              <br />
              <span className="text-amber-700">for Modern</span>
              <br />
              Living
            </h1>

            <p className="text-gray-500 text-sm sm:text-base lg:text-lg max-w-lg mb-6 sm:mb-8 leading-relaxed">
              Discover luxury-quality products with fast delivery, trusted payments, and premium customer experience.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/15 text-xs sm:text-sm lg:text-base"
              >
                Shop Now
                <ArrowRight size={16} className="sm:w-[17px]" />
              </Link>
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all text-xs sm:text-sm lg:text-base"
              >
                Explore Collection
              </Link>
            </div>

            <div className="flex items-center gap-6 sm:gap-8 md:gap-12 mt-8 sm:mt-10">
              {[
                { value: '10K+', label: 'Products' },
                { value: '50K+', label: 'Happy Clients' },
                { value: '4.9', label: 'Avg Rating' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-square sm:aspect-[4/5] lg:aspect-[4/5] w-full max-w-sm sm:max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-transparent to-amber-50/20 rounded-2xl sm:rounded-3xl" />
              <Image
                src="/images/banners/zkzb.PNG"
                alt="Premium Lifestyle Collection"
                fill
                className="object-cover rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}