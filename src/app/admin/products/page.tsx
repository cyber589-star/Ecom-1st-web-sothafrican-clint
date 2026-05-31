'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Plus, Search, Edit, Trash2, X, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatZAR } from '@/components/ui/PriceDisplay'

interface ProductForm {
  name: string; slug: string; description: string; price: string; comparePrice: string
  images: string; category: string; categorySlug: string; tags: string
  rating: string; reviews: string; inStock: boolean; featured: boolean
}

const emptyForm: ProductForm = {
  name: '', slug: '', description: '', price: '', comparePrice: '',
  images: '', category: '', categorySlug: '', tags: '', rating: '5.0',
  reviews: '0', inStock: true, featured: false,
}

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const res = await fetch('/api/products')
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || `HTTP ${res.status}`) }
      const data = await res.json()
      setProductList(Array.isArray(data) ? data : [])
    } catch (e: any) {
      const m = (e?.message || 'network error').replace(/<[^>]+>/g, '').slice(0, 200)
      toast.error('Failed to load products: ' + m)
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const filtered = productList.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || `HTTP ${res.status}`) }
      setProductList(prev => prev.filter(p => p.id !== id)); toast.success('Product deleted')
    } catch (e: any) { toast.error('Delete failed: ' + (e?.message || 'network error')) }
  }

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowModal(true) }

  const openEdit = (product: any) => {
    setForm({
      name: product.name, slug: product.slug, description: product.description,
      price: String(product.price), comparePrice: product.compareprice ? String(product.compareprice) : '',
      images: (product.images || []).join('\n'), category: product.categoryid || product.category || '',
      categorySlug: product.categoryslug || product.categorySlug || '', tags: (product.tags || []).join(', '),
      rating: String(product.rating || 5), reviews: String(product.reviews || 0),
      inStock: product.instock ?? product.inStock ?? true, featured: product.featured || false,
    })
    setEditingId(product.id); setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return }
    setSaving(true)
    const tags = form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : []
    const images = form.images ? form.images.split('\n').map(s => s.trim()).filter(Boolean) : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80']
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now()
    const p = parseFloat(form.price)
    const cp = form.comparePrice ? parseFloat(form.comparePrice) : null
    const cat = form.category || ''
    const catSlug = cat ? cat.toLowerCase().replace(/\s+/g, '-') : ''
    const payload = {
      name: form.name, slug, description: form.description,
      price: p,
      compareprice: cp,
      comparePrice: cp,
      images, tags,
      categoryid: cat,
      category: cat,
      categoryslug: catSlug,
      categorySlug: catSlug,
      rating: parseFloat(form.rating) || 5,
      reviews: parseInt(form.reviews) || 0,
      featured: form.featured,
      instock: form.inStock,
      inStock: form.inStock,
    }

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || `HTTP ${res.status}`) }
      toast.success(editingId ? 'Product updated' : 'Product added')
      setShowModal(false); load()
    } catch (e: any) { toast.error('Save failed: ' + (e?.message || 'unknown')) }
    finally { setSaving(false) }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('File too large (max 5MB)'); return }
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'products')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || `HTTP ${res.status}`) }
      const data = await res.json()
      const currentImages = form.images ? form.images.split('\n').map(s => s.trim()).filter(Boolean) : []
      currentImages.push(data.url)
      setForm({...form, images: currentImages.join('\n')})
      toast.success('Image uploaded')
    } catch (e: any) { toast.error('Upload failed: ' + (e?.message || 'network error')) }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Products</h1>
          <p className="text-xs text-gray-500 mt-0.5">{productList.length} product{productList.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm">
          <Plus size={14} /> Add Product
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..." className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400" />
      </div>

      <div className="rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left p-3 text-gray-500 font-medium">Product</th>
                <th className="text-left p-3 text-gray-500 font-medium">Category</th>
                <th className="text-left p-3 text-gray-500 font-medium">Price</th>
                <th className="text-left p-3 text-gray-500 font-medium">Rating</th>
                <th className="text-left p-3 text-gray-500 font-medium">Stock</th>
                <th className="text-right p-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-12 text-center">
                  <Package size={28} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">No products found</p>
                  <button onClick={openAdd} className="mt-3 text-xs text-amber-700 hover:text-amber-600">Add your first product</button>
                </td></tr>
              )}
              {filtered.map((product, i) => (
                <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 overflow-hidden shrink-0">
                        <Image src={product.images?.[0] || ''} alt={product.name} width={32} height={32} className="object-contain w-full h-full" />
                      </div>
                      <span className="text-gray-900 font-medium truncate max-w-[180px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-gray-500">{product.category}</td>
                  <td className="p-3 text-amber-700 font-semibold">{formatZAR(product.price)}</td>
                  <td className="p-3 text-gray-500">{product.rating}</td>
                  <td className="p-3">
                    <button onClick={async () => { try { const cur = product.instock ?? product.inStock; const r = await fetch(`/api/products/${product.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ instock: !cur, inStock: !cur }) }); if (!r.ok) throw Error(); setProductList(prev => prev.map(p => p.id === product.id ? { ...p, instock: !cur, inStock: !cur } : p)); toast.success('Stock updated') } catch { toast.error('Failed to update') } }}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium cursor-pointer transition-all ${
                        (product.instock ?? product.inStock) ? 'bg-emerald-100 text-emerald-700 hover:bg-red-100 hover:text-red-700' : 'bg-red-100 text-red-700 hover:bg-emerald-100 hover:text-emerald-700'
                      }`}>
                      {(product.instock ?? product.inStock) ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      <button onClick={async () => { try { const cur = product.featured; const r = await fetch(`/api/products/${product.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ featured: !cur }) }); if (!r.ok) throw Error(); setProductList(prev => prev.map(p => p.id === product.id ? { ...p, featured: !cur } : p)); toast.success('Featured updated') } catch { toast.error('Failed to update') } }}
                        className={`p-1.5 rounded transition-all ${
                          product.featured ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                        }`} title={product.featured ? 'Remove featured' : 'Mark as featured'}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill={product.featured ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      </button>
                      <button onClick={() => openEdit(product)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded"><Edit size={13} /></button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border border-gray-200 p-5 max-w-xl w-full my-8 shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-gray-900">{editingId ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Product Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="col-span-2 bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400" />
              <div><label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Slug</label>
                <input placeholder="product-slug" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400" /></div>
              <div><label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Category (optional)</label>
                <input placeholder="e.g. Phone Accessories" value={form.category} onChange={e => setForm({...form, category: e.target.value, categorySlug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400" /></div>
              <div><label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Price (ZAR) *</label>
                <input placeholder="0.00" type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400" />
                {form.price && <p className="text-[10px] text-gray-400 mt-1">Preview: <span className="text-amber-700 font-semibold">{formatZAR(form.price)}</span></p>}</div>
              <div><label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Original Price (optional)</label>
                <input placeholder="0.00" type="number" step="0.01" min="0" value={form.comparePrice} onChange={e => setForm({...form, comparePrice: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400" /></div>
              <div><label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Rating</label>
                <input placeholder="5.0" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400" /></div>
              <div><label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Reviews</label>
                <input placeholder="0" type="number" value={form.reviews} onChange={e => setForm({...form, reviews: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400" /></div>
              <div className="col-span-2"><label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Tags</label>
                <input placeholder="premium, leather, case" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400" /></div>
              <div className="col-span-2"><label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Description</label>
                <textarea placeholder="Product description..." rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 resize-none" /></div>
              <div className="col-span-2"><label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Images</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  <input type="file" accept="image/*" onChange={handleImageUpload}
                    className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
                </div>
                <textarea placeholder="Image URLs (one per line)" rows={2} value={form.images} onChange={e => setForm({...form, images: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 resize-none" /></div>
              <label className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded-lg px-3.5 py-2.5 border border-gray-200 cursor-pointer hover:border-amber-300 transition-all">
                <span className="font-medium">In Stock</span>
                <div className={`relative w-9 h-5 rounded-full transition-colors ${form.inStock ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                  <input type="checkbox" checked={form.inStock} onChange={e => setForm({...form, inStock: e.target.checked})} className="sr-only" />
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${form.inStock ? 'translate-x-4' : ''}`} />
                </div>
              </label>
              <label className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded-lg px-3.5 py-2.5 border border-gray-200 cursor-pointer hover:border-amber-300 transition-all">
                <span className="font-medium">Featured</span>
                <div className={`relative w-9 h-5 rounded-full transition-colors ${form.featured ? 'bg-amber-500' : 'bg-gray-300'}`}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="sr-only" />
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${form.featured ? 'translate-x-4' : ''}`} />
                </div>
              </label>
            </div>
            <div className="flex gap-2.5 mt-6 pt-4 border-t border-gray-100">
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white py-2.5 rounded-lg text-xs font-semibold transition-all shadow-sm">
                {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
              </button>
              <button onClick={() => setShowModal(false)} disabled={saving}
                className="px-5 py-2.5 rounded-lg text-xs text-gray-500 hover:text-gray-700 border border-gray-200 hover:bg-gray-50">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}