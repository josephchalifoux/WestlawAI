'use client'
import { supabase } from '../../../lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    router.push('/draft')
  }

  return (
    <main className="container max-w-md py-16">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">Create account</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input className="rounded-md border border-zinc-300 px-3 py-2" placeholder="email"
               type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="rounded-md border border-zinc-300 px-3 py-2" placeholder="password"
               type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading}
                className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-medium hover:bg-zinc-900 hover:text-white">
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p className="mt-4 text-sm text-zinc-600">
        Have an account? <a className="underline" href="/signin">Sign in</a>.
      </p>
    </main>
  )
}
