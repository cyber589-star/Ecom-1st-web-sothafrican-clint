'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, X, FolderOpen } from 'lucide-react'
import toast from 'react-hot-toast'

interface CatForm { name: string; slug: string; image: string; description: string }
const emptyForm: CatForm = { name: '', slug: '', image: '', description: '' }

export default function AdminCategoriesPage() {
  const [categoryList, setCategoryList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CatForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const res = await fetch('/api/categories?_=' + Date.now())
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || `HTTP ${res.status}`) }
      const data = await res.json()
      setCategoryList(Array.isArray(data) ? data : [])
    } catch (e: any) {
      const m = (e?.message || 'network error').replace(/<[^>]+>/g, '').slice(0, 200)
      toast.error('Failed to load categories: ' + m)
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || `HTTP ${res.status}`) }
      setCategoryList(prev => prev.filter(c => c.id !== id)); toast.success('Category deleted')
    } catch (e: any) {
      const m = (e?.message || 'network error').replace(/<[^>]+>/g, '').slice(0, 200)
      toast.error('Delete failed: ' + m)
    }
  }

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowModal(true) }
  const openEdit = (cat: any) => { setForm({ name: cat.name, slug: cat.slug, image: cat.image, description: cat.description }); setEditingId(cat.id); setShowModal(true) }

  const handleSubmit = async () => {
    if (!form.name) { toast.error('Category name is required'); return }
    setSaving(true)
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now()
    const payload = { name: form.name, slug, image: form.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', description: form.description }

    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || `HTTP ${res.status}`) }
      toast.success(editingId ? 'Category updated' : 'Category added')
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
      formData.append('folder', 'categories')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || `HTTP ${res.status}`) }
      const data = await res.json()
      setForm({...form, image: data.url})
      toast.success('Image uploaded')
    } catch (e: any) { toast.error('Upload failed: ' + (e?.message || 'network error')) }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Categories</h1>
          <p className="text-xs text-gray-500 mt-0.5">{categoryList.length} categor{categoryList.length === 1 ? 'y' : 'ies'}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm">
          <Plus size={14} /> Add Category
        </button>
      </div>

      {categoryList.length === 0 ? (
        <div className="rounded-xl bg-white border border-gray-200 p-12 text-center shadow-sm">
          <FolderOpen size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No categories yet</p>
          <button onClick={openAdd} className="mt-3 text-xs text-amber-700 hover:text-amber-600">Create your first category</button>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categoryList.map((cat, i) => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="rounded-xl bg-white border border-gray-200 p-4 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">/{cat.slug}</p>
                {cat.description && <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{cat.description}</p>}
                <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mt-2 inline-block">{cat.productCount || 0} products</span>
              </div>
              <div className="flex gap-1 ml-3 shrink-0">
                <button onClick={() => openEdit(cat)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded"><Edit size={13} /></button>
                <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={13} /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border border-gray-200 p-5 max-w-md w-full shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-gray-900">{editingId ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Name *</label>
                <input placeholder="Category Name" value={form.name} onChange={e => setForm({...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400" /></div>
              <div><label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Slug</label>
                <input placeholder="category-slug" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400" /></div>
              <div><label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Image</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  <input type="file" accept="image/*" onChange={handleImageUpload}
                    className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
                  {form.image && <span className="text-[10px] text-green-600 self-center">✓ uploaded</span>}
                </div>
                <input placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400" /></div>
              <div><label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Description</label>
                <textarea placeholder="Category description..." rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 resize-none" /></div>
            </div>
            <div className="flex gap-2.5 mt-5 pt-4 border-t border-gray-100">
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white py-2.5 rounded-lg text-xs font-semibold transition-all shadow-sm">
                {saving ? 'Saving...' : editingId ? 'Update Category' : 'Add Category'}
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