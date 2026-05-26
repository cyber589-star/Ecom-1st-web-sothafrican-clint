import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomBytes } from 'crypto'

const SECRET = process.env.ADMIN_SECRET || 'pridepromart-admin-secret-change-me'

function signToken(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 86400000 })).toString('base64url')
  const sig = createHash('sha256').update(`${header}.${body}.${SECRET}`).digest('base64url')
  return `${header}.${body}.${sig}`
}

function verifyToken(token: string): any {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [header, body, sig] = parts
  const expected = createHash('sha256').update(`${header}.${body}.${SECRET}`).digest('base64url')
  if (sig !== expected) return null
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
  if (payload.exp < Date.now()) return null
  return payload
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@pridepromart.co.za'
    const adminPassword = process.env.ADMIN_PASSWORD || ''

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    if (email.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signToken({ email: email.toLowerCase(), role: 'admin' })
    const res = NextResponse.json({ success: true, token })
    res.cookies.set('admin_token', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 86400 })
    return res
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Login failed' }, { status: 500 })
  }
}