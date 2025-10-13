import { ArrowRight } from "lucide-react";


export default function Page() {
return (
<div>
<header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
<div className="container flex h-16 items-center justify-between">
<div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
<span className="inline-block h-2 w-2 rounded-full bg-zinc-900" />
WestlawAI
</div>
<nav className="hidden items-center gap-6 text-sm text-zinc-700 sm:flex">
<a className="hover:text-black" href="#features">Features</a>
<a className="hover:text-black" href="#templates">Templates</a>
<a className="hover:text-black" href="#pricing">Pricing</a>
<a className="hover:text-black" href="/draft">Start drafting</a>
</nav>
</div>
</header>


<main className="container grid grid-cols-1 items-end gap-10 py-16 md:grid-cols-12 md:py-24">
<h1 className="col-span-1 text-4xl/[1.05] sm:text-5xl/[1.05] md:col-span-8 md:text-6xl/[1.03] font-semibold tracking-tight">
Draft <span className="underline decoration-zinc-900 decoration-[2px] underline-offset-4">court‑ready</span> pleadings
with exactness & essentiality.
</h1>
<div className="col-span-1 md:col-span-4">
<p className="text-base text-zinc-700">
Minimal UI. Maximal clarity. Search law with provenance, assemble arguments, and export to DOCX/PDF without the noise.
</p>
<div className="mt-6 flex flex-wrap items-center gap-3">
<a href="/draft" className="group inline-flex items-center gap-2 rounded-full border border-zinc-900 px-4 py-2 text-sm font-medium hover:bg-zinc-900 hover:text-white transition-colors">
Start drafting <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
</a>
<a href="#how" className="inline-flex items-center gap-2 text-sm text-zinc-700 hover:text-black">How it works</a>
</div>
</div>
</main>


<div className="rule" />


<section id="features" className="container grid grid-cols-1 gap-10 py-12 sm:py-16 md:grid-cols-12">
{[{t:"Editorial layout",b:"Large type, strict grid, and hairline rules keep focus on the argument—not the UI."},{t:"Provenance-first",b:"Hybrid search (keyword + embeddings) with pinned citations you can verify."},{t:"Exports that hold up",b:"One click DOCX and PDF exports preserve structure, headings, and citations."}].map((f)=> (
<div key={f.t} className="md:col-span-4">
<h3 className="text-base font-semibold tracking-tight">{f.t}</h3>
<p className="mt-2 text-sm text-zinc-700">{f.b}</p>
</div>
))}
</section>


<footer className="border-t border-zinc-200">
<div className="container flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
<p className="text-sm text-zinc-600">© {new Date().getFullYear()} WestlawAI</p>
<div className="flex items-center gap-6 text-sm text-zinc-700">
<a className="hover:text-black" href="/privacy">Privacy</a>
}
