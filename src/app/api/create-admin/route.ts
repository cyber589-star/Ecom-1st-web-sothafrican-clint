import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  return NextResponse.json({
    error: 'Set ADMIN_EMAIL and ADMIN_PASSWORD in your Vercel env vars, then sign in.',
    docs: 'Add ADMIN_EMAIL and ADMIN_PASSWORD to your Vercel project environment variables.',
  }, { status: 400 })
}