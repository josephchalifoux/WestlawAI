// app/debug/export/page.tsx
"use client";

import { useState } from "react";
import { PRESETS } from "../../../lib/export/presets";

export default function ExportDebug() {
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const [format, setFormat] = useState<"docx" | "pdf">("docx");
  const [title, setTitle] = useState("Sample Motion");
  const [text, setText] = useState(
    "This is a sample paragraph for export v1. Replace with your drafted pleading text."
  );
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          presetId,
          format,
          blocks: [
            { type: "heading", text: title },
            { type: "paragraph", text }
          ]
        })
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "_")}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-6 sm:px-8 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Export tester</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <label className="block text-sm font-medium text-zinc-700">
            Title
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="mt-4 block text-sm font-medium text-zinc-700">
            Body
          </label>
          <textarea
            className="mt-1 h-48 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-zinc-700">
            Preset
          </label>
          <select
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            value={presetId}
            onChange={(e) => setPresetId(e.target.value)}
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-sm font-medium text-zinc-700">
            Format
          </label>
          <select
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            value={format}
            onChange={(e) =>
              setFormat(e.target.value === "pdf" ? "pdf" : "docx")
            }
          >
            <option value="docx">DOCX</option>
            <option value="pdf">PDF</option>
          </select>

          <button
            onClick={run}
            disabled={busy}
            className="mt-6 w-full rounded-full border border-zinc-900 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-900 hover:text-white disabled:opacity-60"
          >
            {busy ? "Generating…" : "Generate & Download"}
          </button>
        </div>
      </div>
    </main>
  );
}
