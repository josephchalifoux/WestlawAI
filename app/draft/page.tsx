'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase/client'

export default function DraftPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [plan, setPlan] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
    })
  }, [])

  async function saveDraft() {
    setSaving(true); setMessage(null)
    const { data: auth } = await supabase.auth.getUser()
    const uid = auth.user?.id
    if (!uid) { setMessage('Please sign in.'); setSaving(false); return }

    // Create a default case if none exists yet (simplest starter behavior)
    const { data: caseRow, error: caseErr } = await supabase
      .from('cases')
      .insert({ user_id: uid, title: 'Untitled Case' })
      .select('*')
      .single()

    if (caseErr) { setMessage(caseErr.message); setSaving(false); return }

    const { error: docErr } = await supabase
      .from('documents')
      .insert({ user_id: uid, case_id: caseRow.id, kind: 'plan', title: 'Initial Plan', content: { plan } })

    if (docErr) { setMessage(docErr.message) }
    else { setMessage('Saved to your account.'); setPlan('') }
    setSaving(false)
  }

  if (!userEmail) {
    return (
      <main className="container py-10">
        <h2 className="text-2xl font-semibold tracking-tight">Draft</h2>
        <p className="mt-2 text-zinc-700">
          Please <a href="/signin" className="underline">sign in</a> or <a href="/signup" className="underline">create an account</a> to start drafting.
        </p>
      </main>
    )
  }

  return (
    <main className="container grid grid-cols-1 gap-6 py-10 md:grid-cols-12">
      <section className="md:col-span-7">
        <h3 className="text-base font-semibold tracking-tight">Plan (conversation)</h3>
        <textarea value={plan} onChange={e=>setPlan(e.target.value)}
                  placeholder="Describe your matter, issues, and goals…"
                  className="mt-2 h-48 w-full rounded-md border border-zinc-300 p-3" />
        <div className="mt-3 flex items-center gap-3">
          <button onClick={saveDraft} disabled={saving}
                  className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-medium hover:bg-zinc-900 hover:text-white">
            {saving ? 'Saving…' : 'Save plan'}
          </button>
          {message && <span className="text-sm text-zinc-600">{message}</span>}
        </div>
      </section>

      <aside className="md:col-span-5">
        <div className="rounded-xl border border-zinc-200 p-4">
          <h4 className="text-sm font-semibold tracking-tight">Output layout</h4>
          <p className="mt-1 text-sm text-zinc-600">Presets coming next. Export is stubbed for now.</p>
          <form className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <label className="col-span-2">Format
              <select className="mt-1 w-full rounded-md border border-zinc-300 p-2">
                <option>PDF</option>
                <option>DOCX</option>
              </select>
            </label>
            <button type="button" onClick={async ()=>{
              const res = await fetch('/api/export', {
                method:'POST',
                headers:{'content-type':'application/json'},
                body: JSON.stringify({
                  doc: { sections: [{ heading: 'Plan', body: plan }] },
                  style: { font_family: 'Times New Roman', font_size_pt: 12 },
                  format: 'pdf'
                })
              })
              const out = await res.json().catch(()=> ({}))
              if (out?.url) window.open(out.url, '_blank')
            }} className="col-span-2 rounded-full border border-zinc-900 px-4 py-2 font-medium hover:bg-zinc-900 hover:text-white">
              Export (stub)
            </button>
          </form>
        </div>
      </aside>
    </main>
  )
}
