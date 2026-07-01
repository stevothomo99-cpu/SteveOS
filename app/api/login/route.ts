import { NextResponse } from 'next/server'
import { createSession, validateCredentials } from '../../../lib/auth'

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')
  const user = validateCredentials(email, password)

  if (!user) {
    return NextResponse.redirect(new URL('/login?error=1', request.url), 303)
  }

  await createSession(user.email)
  return NextResponse.redirect(new URL('/', request.url), 303)
}
