export const metadata = {
  title: 'Pricing • WestlawAI',
  description: 'Simple plans for solo to enterprise. Court-ready outputs.',
};

const plans = [
  {
    name: 'Individual / Base',
    price: '$129/mo',
    blurb: 'For solos getting started.',
    features: [
      'Unlimited drafting workspace',
      'Save cases & documents',
      'Court-style presets (basic)',
      'Email support',
    ],
    cta: { label: 'Choose Base', href: '/signin' }, // swap to Stripe Checkout later
  },
  {
    name: 'Individual / Unlimited',
    price: '$279/mo',
    blurb: 'For practitioners shipping daily.',
    features: [
      'Everything in Base',
      'Unlimited exports (DOCX/PDF)',
      'Advanced court-style presets',
      'Priority support',
    ],
    cta: { label: 'Choose Unlimited', href: '/signin' },
    highlight: true,
  },
  {
    name: 'Enterprise / Team',
    price: '$999/mo',
    blurb: 'For firms and legal teams.',
    features: [
      'Seats & roles',
      'Team shared libraries',
      'SAML SSO (add-on)',
      'Billing via invoice',
    ],
    cta: { label: 'Talk to sales', href: '/ensemble' },
  },
  {
    name: 'Ensemble',
    price: 'Custom Pricing',
    blurb: 'Aggregated research with Westlaw / Lexis (subject to agreements).',
    features: [
      'Dual-LLM “Scout + Writer”',
      'Provenance-first citations',
      'Custom connectors & usage meters',
      'Dedicated support & training',
    ],
    cta: { label: 'Request custom quote', href: '/ensemble' },
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 sm:px-8 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-3 text-zinc-700">
        Minimal interface. Court-ready outputs. Pick the plan that fits your docket.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl border border-zinc-200 p-6 ${p.highlight ? 'shadow-md ring-1 ring-zinc-900/5' : ''}`}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold tracking-tight">{p.name}</h3>
              <div className="text-sm text-zinc-600">{p.price}</div>
            </div>
            <p className="mt-2 text-sm text-zinc-700">{p.blurb}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-zinc-900" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={p.cta.href}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-zinc-900 px-4 py-2 text-sm font-medium hover:bg-zinc-900 hover:text-white transition-colors"
            >
              {p.cta.label}
            </a>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-zinc-200 p-6">
        <h2 className="text-base font-semibold tracking-tight">Notes</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700 space-y-1">
          <li>“Ensemble” surfaces aggregated research and requires separate data agreements.</li>
          <li>Stripe price IDs will be wired when you’re ready to accept payments.</li>
          <li>OCR & heavy PDF parsing can be enabled behind a feature flag.</li>
        </ul>
      </div>
    </main>
  );
}
