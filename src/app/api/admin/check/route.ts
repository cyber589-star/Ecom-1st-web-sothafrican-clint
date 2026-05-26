import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

const SECRET = process.env.ADMIN_SECRET || 'pridepromart-admin-secret-change-me'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value || ''
  if (!token) return NextResponse.json({ authenticated: false })

  const parts = token.split('.')
  if (parts.length !== 3) return NextResponse.json({ authenticated: false })
  const [header, body, sig] = parts
  const expected = createHash('sha256').update(`${header}.${body}.${SECRET}`).digest('base64url')
  if (sig !== expected) return NextResponse.json({ authenticated: false })

  const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
  if (payload.exp < Date.now()) return NextResponse.json({ authenticated: false })

  return NextResponse.json({ authenticated: true, email: payload.email })
}