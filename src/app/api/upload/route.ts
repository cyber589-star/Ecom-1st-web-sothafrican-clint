import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    const folder = (formData.get('folder') as string) || 'products'
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())
    const admin = getSupabaseAdmin()

    const { error: uploadErr } = await admin.storage.from('images').upload(path, buffer, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    })
    if (uploadErr) {
      return NextResponse.json({ error: `Upload failed: ${uploadErr.message}` }, { status: 500 })
    }

    const { data } = admin.storage.from('images').getPublicUrl(path)
    return NextResponse.json({ url: data?.publicUrl || '' })
  } catch (e: any) {
    return NextResponse.json({ error: `Upload error: ${e?.message || 'unknown'}` }, { status: 500 })
  }
}