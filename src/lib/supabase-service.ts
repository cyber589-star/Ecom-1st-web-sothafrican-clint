import { getSupabaseAdmin, getSupabaseServer } from './supabase-server'
import { getSupabase } from './supabase'

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ─── Products ────────────────────────────────────────────
export async function listProducts() {
  const { data, error } = await getSupabaseServer().from('products').select('*').order('createdAt', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getProduct(id: string) {
  const { data, error } = await getSupabaseServer().from('products').select('*').eq('id', id).single()
  if (error) return null
  return data
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await getSupabaseServer().from('products').select('*').eq('slug', slug).maybeSingle()
  if (error) return null
  return data
}

export async function searchProductsAPI(query: string) {
  const q = query.toLowerCase()
  const { data, error } = await getSupabaseServer()
    .from('products')
    .select('*')
    .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
    .order('createdAt', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createProduct(product: any) {
  const slug = product.slug || toSlug(product.name) + '-' + Date.now()
  const id = product.id || String(Date.now()) + '-' + Math.random().toString(36).slice(2, 6)
  const { data, error } = await getSupabaseAdmin().from('products').insert({ ...product, id, slug }).select().single()
  if (error) throw error
  return data
}

export async function updateProduct(id: string, updates: any) {
  const { data, error } = await getSupabaseAdmin().from('products').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteProduct(id: string) {
  const { error } = await getSupabaseAdmin().from('products').delete().eq('id', id)
  if (error) throw error
}

// ─── Categories ──────────────────────────────────────────
export async function listCategories() {
  const { data, error } = await getSupabaseServer().from('categories').select('*').order('name')
  if (error) throw error
  return data || []
}

export async function getCategory(id: string) {
  const { data, error } = await getSupabaseServer().from('categories').select('*').eq('id', id).single()
  if (error) return null
  return data
}

export async function createCategory(category: any) {
  const slug = category.slug || toSlug(category.name) + '-' + Date.now()
  const id = category.id || slug
  const { data, error } = await getSupabaseAdmin().from('categories').insert({ ...category, id, slug }).select().single()
  if (error) throw error
  return data
}

export async function updateCategory(id: string, updates: any) {
  const { data, error } = await getSupabaseAdmin().from('categories').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteCategory(id: string) {
  const { error } = await getSupabaseAdmin().from('categories').delete().eq('id', id)
  if (error) throw error
}

// ─── Orders ──────────────────────────────────────────────
export async function listOrders() {
  const { data, error } = await getSupabaseServer().from('orders').select('*').order('createdAt', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getOrder(id: string) {
  const { data, error } = await getSupabaseServer().from('orders').select('*').eq('id', id).single()
  if (error) return null
  return data
}

export async function createOrder(order: any) {
  const { data, error } = await getSupabaseAdmin().from('orders').insert(order).select().single()
  if (error) throw error
  return data
}

export async function updateOrder(id: string, updates: any) {
  const { data, error } = await getSupabaseAdmin().from('orders').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteOrder(id: string) {
  const { error } = await getSupabaseAdmin().from('orders').delete().eq('id', id)
  if (error) throw error
}

// ─── Storage ────────────────────────────────────────────
export async function uploadImage(file: File, bucket = 'images') {
  const ext = file.name.split('.').pop()
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await getSupabaseAdmin().storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data: urlData } = getSupabaseAdmin().storage.from(bucket).getPublicUrl(path)
  return urlData?.publicUrl || ''
}

export async function deleteImage(path: string, bucket = 'images') {
  await getSupabaseAdmin().storage.from(bucket).remove([path])
}

// ─── Auth ────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const { data, error } = await getSupabase().auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await getSupabase().auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data } = await getSupabase().auth.getSession()
  return data.session
}

export async function getCurrentUser() {
  const { data } = await getSupabase().auth.getUser()
  return data.user
}
