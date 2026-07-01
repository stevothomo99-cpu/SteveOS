import { redirect } from 'next/navigation'
import { getCurrentUser } from '../../lib/auth'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getCurrentUser()
  if (user) redirect('/')

  const params = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">SteveOS</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Sign in</h1>
        <p className="mt-2 text-sm text-slate-400">Private access to Mission Control.</p>

        {params.error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            Incorrect email or password.
          </div>
        )}

        <form action="/api/login" method="post" className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>
            <input name="email" type="email" required autoComplete="email" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-sky-500/60" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Password</span>
            <input name="password" type="password" required autoComplete="current-password" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-sky-500/60" />
          </label>
          <button type="submit" className="w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-400">
            Sign in
          </button>
        </form>
      </div>
    </main>
  )
}
