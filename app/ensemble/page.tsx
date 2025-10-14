export const metadata = {
  title: 'Request a Custom Quote • WestlawAI',
  description: 'Ensemble tier with Westlaw/Lexis connectors (subject to agreement).',
};

export default function EnsembleQuote() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 sm:px-8 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Request a custom quote</h1>
      <p className="mt-2 text-zinc-700">
        Tell us about your team and expected research volume. We’ll follow up with pricing tailored to your usage and data agreements.
      </p>

      <form className="mt-8 grid gap-4" method="post" action="mailto:sales@westlawai.com">
        <div>
          <label className="text-sm font-medium">Full name</label>
          <input className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" name="name" required />
        </div>
        <div>
          <label className="text-sm font-medium">Work email</label>
          <input type="email" className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" name="email" required />
        </div>
        <div>
          <label className="text-sm font-medium">Organization</label>
          <input className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" name="org" />
        </div>
        <div>
          <label className="text-sm font-medium">Jurisdictions & data sources</label>
          <textarea className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" name="sources" rows={3}
            placeholder="E.g., FL & 11th Cir., Westlaw + state reporters" />
        </div>
        <div>
          <label className="text-sm font-medium">Expected monthly research volume (rough)</label>
          <input className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" name="volume" placeholder="e.g., 5k queries / 1M tokens" />
        </div>
        <button className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-zinc-900 px-4 py-2 text-sm font-medium hover:bg-zinc-900 hover:text-white transition-colors">
          Send request
        </button>
      </form>
    </main>
  );
}
