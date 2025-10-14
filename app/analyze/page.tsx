"use client";
import React, { useState } from "react";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [uploadName, setUploadName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function onAnalyze() {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setReport(data);
    } catch (e: any) {
      setError(e.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadName(f.name);
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setText(String(data.text || ""));
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 sm:px-8 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Document Analyzer</h1>
      <p className="mt-2 text-sm text-zinc-700">
        Upload a <b>.pdf</b>, <b>.docx</b>, or <b>.txt</b> (we’ll extract text), or paste below. Then run the analysis.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-900 px-4 py-2 text-sm font-medium hover:bg-zinc-900 hover:text-white transition-colors">
            <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={onFile} />
            Upload .pdf / .docx / .txt
          </label>
          {uploadName && <span className="ml-3 text-sm text-zinc-600 truncate align-middle">Selected: {uploadName}</span>}

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={16}
            placeholder="(Optional) Paste or edit the extracted text here before analyzing…"
            className="mt-4 w-full rounded-xl border border-zinc-300 p-4 outline-none focus:ring-2 focus:ring-zinc-900"
          />

          <button
            onClick={onAnalyze}
            disabled={!text.trim() || loading}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-900 px-5 py-2 text-sm font-medium hover:bg-zinc-900 hover:text-white transition-colors disabled:opacity-40"
          >
            {loading ? "Analyzing…" : "Run analysis"}
          </button>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>

        <aside className="md:col-span-4">
          <div className="rounded-2xl border border-zinc-200 p-4">
            <h2 className="text-base font-semibold tracking-tight">What we flag (MVP)</h2>
            <ul className="mt-2 text-sm text-zinc-700 list-disc pl-5 space-y-1">
              <li>Missing elements or particularity</li>
              <li>Weak/non-cognizable counts</li>
              <li>Procedural gaps (certificates, notices, word limits)</li>
              <li>Low/zero citations near assertions</li>
            </ul>
          </div>
        </aside>
      </div>

      {report && (
        <div className="mt-10 space-y-8">
          <Section title="Strengths" items={report.strengths} />
          <Section title="Issues / Weaknesses" items={report.issues} />
          <Section title="Missing Elements" items={report.missing} />
          <Section title="Suggestions" items={report.suggestions} />
        </div>
      )}
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <section>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700 space-y-1">
        {items.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </section>
  );
}
