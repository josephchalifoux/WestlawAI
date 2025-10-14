// app/debug/flags/page.tsx
import { flags } from '../../../lib/flags';

export const metadata = { title: 'Flags • WestlawAI' };

export default function FlagsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 sm:px-8 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Feature flags</h1>
      <div className="mt-6 rounded-xl border border-zinc-200 p-6">
        <dl className="space-y-4">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-zinc-700">USE_EXTERNAL_PARSER (server)</dt>
            <dd className="text-sm font-medium">
              {flags.useExternalParser ? 'true' : 'false'}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-sm text-zinc-700">NEXT_PUBLIC_USE_EXTERNAL_PARSER (ui hint)</dt>
            <dd className="text-sm font-medium">
              {flags.useExternalParserPublic ? '1' : '0'}
            </dd>
          </div>
        </dl>
      </div>
      <p className="mt-6 text-sm text-zinc-600">
        Toggle these in Vercel → Settings → Environment Variables, then redeploy.
      </p>
    </main>
  );
}
