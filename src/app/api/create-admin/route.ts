import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    if (password.length < 4) {
      return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

    // Step 1: Create user via anon key signup
    const signupRes = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ email, password }),
    })

    const signupData = await signupRes.json()

    if (!signupRes.ok) {
      const msg = signupData?.msg || signupData?.error_description || signupData?.error || 'Signup failed'
      if (msg.toLowerCase().includes('already')) {
        return NextResponse.json({ error: 'Admin already exists. Sign in instead.' }, { status: 400 })
      }
      return NextResponse.json({ error: msg }, { status: signupRes.status })
    }

    const userId = signupData?.user?.id || signupData?.id
    if (!userId) {
      // User was created but may need email confirmation
      return NextResponse.json({ success: true, needsConfirm: true, msg: 'Check your email for the confirmation link, then sign in.' })
    }

    // Step 2: Auto-confirm the user with service role key
    if (serviceKey) {
      const normEmail = email.toLowerCase().trim()
      // Find the user in auth.users via the admin API
      const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(normEmail)}`, {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      })
      const listData = await listRes.json()
      const users = listData?.users || []
      const user = users.find((u: any) => u.email?.toLowerCase() === normEmail) || listData

      const uid = user?.id
      if (uid) {
        // Confirm email
        await fetch(`${supabaseUrl}/auth/v1/admin/users/${uid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({
            email_confirmed_at: new Date().toISOString(),
            confirmation_sent_at: new Date().toISOString(),
            confirmed_at: new Date().toISOString(),
            user_metadata: { role: 'admin' },
          }),
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create admin' }, { status: 500 })
  }
}