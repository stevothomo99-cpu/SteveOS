import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE_NAME = 'steveos_session'

type UserRecord = {
  email: string
  password: string
  name?: string
}

function getUsers(): UserRecord[] {
  const raw = process.env.STEVEOS_USERS
  if (!raw) return []

  try {
    const users = JSON.parse(raw)
    return Array.isArray(users) ? users : []
  } catch {
    return []
  }
}

function getSecret() {
  return process.env.STEVEOS_AUTH_SECRET || ''
}

export function isAuthConfigured() {
  return getUsers().length > 0 && Boolean(getSecret())
}

function sign(value: string) {
  return createHmac('sha256', getSecret()).update(value).digest('hex')
}

function makeToken(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + 1000 * 60 * 60 * 24 * 14 })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

function parseToken(token?: string) {
  if (!token || !getSecret()) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null

  const expected = sign(payload)
  const left = Buffer.from(signature)
  const right = Buffer.from(expected)
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (!data.email || !data.exp || Date.now() > data.exp) return null
    return data as { email: string; exp: number }
  } catch {
    return null
  }
}

export function validateCredentials(email: string, password: string) {
  const normalisedEmail = email.trim().toLowerCase()
  return getUsers().find(
    (user) => user.email.trim().toLowerCase() === normalisedEmail && user.password === password,
  ) || null
}

export async function createSession(email: string) {
  const store = await cookies()
  store.set(COOKIE_NAME, makeToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  })
}

export async function clearSession() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function getCurrentUser() {
  if (!isAuthConfigured()) return null

  const store = await cookies()
  const session = parseToken(store.get(COOKIE_NAME)?.value)
  if (!session) return null

  const user = getUsers().find((item) => item.email.trim().toLowerCase() === session.email.toLowerCase())
  return user || null
}

export async function requireUser() {
  if (!isAuthConfigured()) {
    return { email: 'vercel-protected', name: 'Steve' }
  }

  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}
