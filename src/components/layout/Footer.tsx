'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Send } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { fetchCategories } from '@/data/categories'

export default function Footer() {
  const [categoryList, setCategoryList] = useState<any[]>([])
  const [email, setEmail] = useState('')

  useEffect(() => { fetchCategories().then(setCategoryList).catch(() => {}) }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) { toast.success('Subscribed!'); setEmail('') }
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/00a12c53-aa04-42b8-a0dc-a74e02c64e78_removalai_preview.png" alt="PrideProMart" width={120} height={70} className="object-contain h-12 w-auto"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              <span className="text-lg font-bold text-gray-900">PRIDEPROMART</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your premier destination for luxury products. Elegance, quality, and sophistication.
            </p>
            <div className="flex gap-3">
              {['FB', 'IG', 'TW', 'PI'].map((label) => (
                <a key={label} href="#" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-amber-100 flex items-center justify-center text-xs font-bold text-gray-500 hover:text-amber-700 transition-all">
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2.5">
              {categoryList.slice(0, 8).map(cat => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="text-gray-500 hover:text-amber-700 text-sm transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Shop All', href: '/products' },
                { label: 'Collections', href: '/collections' },
                { label: 'Cart', href: '/cart' },
                { label: 'Wishlist', href: '/wishlist' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-500 hover:text-amber-700 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wider">Newsletter</h3>
            <p className="text-gray-500 text-sm mb-3">Subscribe for exclusive offers.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400"
                required />
              <button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white p-2.5 rounded-lg transition-colors">
                <Send size={16} />
              </button>
            </form>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Mail size={14} className="text-amber-600" />
                <span>support@pridepromart.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">&copy; {new Date().getFullYear()} PrideProMart. All rights reserved.</p>
          <div className="flex gap-4 text-gray-400 text-xs">
            <Link href="#" className="hover:text-amber-700 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-amber-700 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
