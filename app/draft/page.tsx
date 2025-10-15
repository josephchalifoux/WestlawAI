// app/draft/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { DEFAULT_PRESET_ID, EXPORT_PRESETS } from "../../lib/export-presets";

type ExportFormat = "docx" | "markdown";

export default function DraftPage() {
  const supabase = useMemo(() => createClient(), []);

  const [plan, setPlan] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string>("");

  const [format, setFormat] = useState<ExportFormat>("docx");
  const [presetId, setPresetId] = useState<string>(DEFAULT_PRESET_ID);
  const preset = useMemo(
    () => EXPORT_PRESETS.find((p) => p.id === presetId) ?? EXPORT_PRESETS[0],
    [presetId]
  );
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // placeholder for future Supabase reads
  }, [supabase]);

  async function handleSave() {
    try {
      setSaving(true);
      setSaveMsg("");
      await new Promise((r) => setTimeout(r, 400));
      setSaveMsg("Saved.");
    } catch (e: any) {
      setSaveMsg(e?.message || "Save failed.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 2000);
    }
  }

  async function handleExport() {
    setDownloading(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: preset?.title || "Draft",
          content: plan,
          format,
          presetId,
        }),
      });

      if (!res.ok) throw new Error((await res.text()) || "Export failed");

      const blob = await res.blob();
      const filename =
        res.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/)?.[1] ??
        (format === "docx" ? "draft.docx" : "draft.md");

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err?.message || "Export failed");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Draft</h1>
        <p className="text-sm text-zinc-500">
          Write your plan here, then export as DOCX or Markdown using presets.
        </p>
      </header>

      <section className="space-y-2">
        <label className="text-sm font-medium">Plan</label>
        <textarea
          className="w-full min-h-[320px] rounded-xl border border-zinc-200/60 bg-white p-4 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          placeholder="Type your motion outline or draft here…"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save draft"}
          </button>
          {saveMsg && <span className="text-sm text-zinc-500">{saveMsg}</span>}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200/60 p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Format</label>
            <select
              className="w-full rounded-lg border border-zinc-300 bg-white p-2"
              value={format}
              onChange={(e) => setFormat(e.target.value as ExportFormat)}
            >
              <option value="docx">DOCX</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">Style preset</label>
            <select
              className="w-full rounded-lg border border-zinc-300 bg-white p-2"
              value={presetId}
              onChange={(e) => setPresetId(e.target.value)}
            >
              {EXPORT_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} — {p.page.size} ({p.page.margins.top}/{p.page.margins.right}/
                  {p.page.margins.bottom}/{p.page.margins.left}")
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-zinc-500">
              Applies page size, margins, and basic paragraph styling to the export.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleExport}
            disabled={downloading || !plan.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {downloading ? "Exporting…" : `Export ${format.toUpperCase()}`}
          </button>
        </div>
      </section>
    </main>
  );
}
