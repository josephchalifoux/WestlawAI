// app/page.tsx
export default function Page() {
  return (
    <div>
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <span className="inline-block h-2 w-2 rounded-full bg-zinc-900" />
            WestlawAI
          </div>
          <nav className="hidden items-center gap-6 text-sm text-zinc-700 sm:flex">
            <a className="hover:text-black" href="/analyze">Analyze</a>
            <a className="hover:text-black" href="/draft">Draft</a>
            <a className="hover:text-black" href="/signin">Sign in</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 sm:px-8 grid grid-cols-1 items-end gap-10 py-16 md:grid-cols-12 md:py-24">
        <h1 className="col-span-1 md:col-span-7 text-4xl/[1.05] sm:text-5xl/[1.05] md:text-6xl/[1.03] font-semibold tracking-tight">
          Minimal interface. <br /> Court-ready outputs.
        </h1>

        <div className="col-span-1 md:col-span-5">
          <div className="rounded-2xl border border-zinc-200 p-4">
            <textarea
              placeholder="Start a conversation… e.g., 'I need to draft a motion to dismiss for lack of personal jurisdiction in Florida.'"
              className="h-28 w-full rounded-xl border border-zinc-300 p-3 outline-none focus:ring-2 focus:ring-zinc-900"
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href="/draft" className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-medium hover:bg-zinc-900 hover:text-white text-center">Draft pleading</a>
              <a href="/analyze" className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-medium hover:bg-zinc-900 hover:text-white text-center">Analyze / upload</a>
              <a href="/draft" className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-medium hover:bg-zinc-900 hover:text-white text-center">Enter fact set</a>
              <a href="/draft" className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-medium hover:bg-zinc-900 hover:text-white text-center">Legal research</a>
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-700">
            WestlawAI suggests plans, drafts with grounded citations, checks local rules, and exports to DOCX/PDF in your court’s style.
          </p>
        </div>
      </main>

      <section className="mx-auto w-full max-w-6xl px-6 sm:px-8 grid grid-cols-1 gap-10 py-12 sm:py-16 md:grid-cols-12">
        {[
          { t: "Plan → Draft → Export", b: "Approve a plan before drafting; add notices/certificates; export only when ready." },
          { t: "Provenance-first", b: "Hybrid search with pinned citations and pincites; reviewer model enforces sources." },
          { t: "Court styles", b: "Fonts, margins, caption & title rules remembered per case/judge." },
        ].map((f) => (
          <div key={f.t} className="md:col-span-4">
            <h3 className="text-base font-semibold tracking-tight">{f.t}</h3>
            <p className="mt-2 text-sm text-zinc-700">{f.b}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
          <p className="text-sm text-zinc-600">© {new Date().getFullYear()} WestlawAI</p>
          <div className="flex items-center gap-6 text-sm text-zinc-700">
            <a className="hover:text-black" href="/privacy">Privacy</a>
            <a className="hover:text-black" href="/terms">Terms</a>
            <a className="hover:text-black" href="mailto:support@westlawai.com">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
