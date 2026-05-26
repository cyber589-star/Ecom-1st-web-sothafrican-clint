'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, Star } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { formatZAR } from '@/components/ui/PriceDisplay'

interface Props {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()
  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden bg-gray-50">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 430px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />
          {discount > 0 && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-amber-600 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
              -{discount}%
            </div>
          )}
          {product.featured && (
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 text-gray-800 text-[9px] sm:text-[10px] font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm border border-gray-100">
              Featured
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span className="text-gray-900 font-semibold text-xs sm:text-sm">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
        <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400 truncate">{product.category}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5">
          <Star size={10} className="sm:w-3 sm:h-3 text-amber-500 fill-amber-500 shrink-0" />
          <span className="text-[10px] sm:text-xs text-gray-500">{product.rating}</span>
          <span className="text-[10px] sm:text-xs text-gray-300">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between pt-1 sm:pt-2">
          <div className="flex items-baseline gap-1.5 sm:gap-2 min-w-0">
            <span className="text-sm sm:text-base font-bold text-gray-900 truncate">{formatZAR(product.price)}</span>
            {product.comparePrice && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through truncate">{formatZAR(product.comparePrice)}</span>
            )}
          </div>
          <div className="flex gap-0.5 sm:gap-1 shrink-0">
            <button
              onClick={() => toggleItem({ id: product.id, name: product.name, price: product.price, image: product.images[0], slug: product.slug })}
              className={`touch-target-sm rounded-lg transition-all ${
                isInWishlist(product.id) ? 'bg-red-50 text-red-400' : 'text-gray-400 hover:text-red-400 hover:bg-red-50'
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart size={13} className="sm:w-[14px]" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.images[0], slug: product.slug, quantity: 1 })}
              disabled={!product.inStock}
              className="touch-target-sm rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all disabled:opacity-30"
              aria-label="Add to cart"
            >
              <ShoppingBag size={13} className="sm:w-[14px]" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}