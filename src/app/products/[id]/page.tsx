'use client'

import { use, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, ShoppingBag, Heart, Minus, Plus, ChevronLeft, Share2 } from 'lucide-react'
import { fetchProducts, fetchProductBySlug } from '@/data/products'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import ProductCard from '@/components/products/ProductCard'
import { formatZAR } from '@/components/ui/PriceDisplay'

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()

  useEffect(() => {
    fetchProductBySlug(id).then(p => {
      setProduct(p)
      if (p) fetchProducts().then(all => setRelatedProducts(all.filter((x: any) => x.categorySlug === p.categorySlug && x.id !== p.id).slice(0, 4)))
    }).finally(() => setLoaded(true))
  }, [id])

  if (!loaded) return <main className="min-h-screen bg-white pt-24 flex items-center justify-center"><div className="w-8 h-8 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin" /></main>
  if (!product) {
    return (
      <main className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/products" className="text-amber-700 hover:text-amber-600">Back to Shop</Link>
        </div>
      </main>
    )
  }

  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0

  return (
    <main className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/products" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-amber-700 text-sm mb-6 transition-colors">
          <ChevronLeft size={16} />
          Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image src={product.images[selectedImage]} alt={product.name} fill className="object-contain p-8" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">-{discount}% OFF</div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-amber-400' : 'border-gray-100 hover:border-gray-200'
                    }`}>
                    <Image src={img} alt="" width={80} height={80} className="object-contain w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-amber-600 mb-2">{product.category}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-200'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">{formatZAR(product.price)}</span>
              {product.comparePrice && <span className="text-lg text-gray-400 line-through">{formatZAR(product.comparePrice)}</span>}
              {discount > 0 && <span className="text-sm text-green-600 font-medium">Save {discount}%</span>}
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-600">{tag}</span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50 text-gray-500 transition-colors"><Minus size={16} /></button>
                <span className="px-6 py-3 text-gray-900 font-medium min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-50 text-gray-500 transition-colors"><Plus size={16} /></button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { for (let i = 0; i < quantity; i++) addItem({ id: product.id, name: product.name, price: product.price, image: product.images[0], slug: product.slug, quantity: 1 }) }}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-40"
              >
                <ShoppingBag size={18} />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={() => toggleItem({ id: product.id, name: product.name, price: product.price, image: product.images[0], slug: product.slug })}
                className={`p-4 rounded-xl border transition-all ${
                  isInWishlist(product.id) ? 'border-red-200 bg-red-50 text-red-400' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
              </button>
              <button className="p-4 rounded-xl border border-gray-200 text-gray-500 hover:border-gray-300 transition-all"><Share2 size={20} /></button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { icon: '🔒', label: 'Secure' },
                { icon: '🚚', label: 'Ships across South Africa' },
                { icon: '↩', label: '30-Day Returns' },
              ].map((item, i) => (
                <div key={i} className="text-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-lg block mb-1">{item.icon}</span>
                  <p className="text-[10px] text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related <span className="text-amber-700">Products</span></h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
