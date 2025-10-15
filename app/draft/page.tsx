// app/draft/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_PRESET_ID, EXPORT_PRESETS } from "@/lib/export-presets";

type ExportFormat = "docx" | "markdown";

export default function DraftPage() {
  const supabase = useMemo(() => createClient(), []);
  const [plan, setPlan] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string>("");

  // Export UI state
  const [format, setFormat] = useState<ExportFormat>("docx");
  const [presetId, setPresetId] = useState<string>(DEFAULT_PRESET_ID);
  const [title, setTitle] = useState<string>("Motion to Dismiss");
  const [includeCertificate, setIncludeCertificate] = useState<boolean>(true);
  const [exporting, setExporting] = useState(false);
  const preset = EXPORT_PRESETS.find((p) => p.id === presetId) ?? EXPORT_PRESETS[0];

  // Optional: restore last typed plan from localStorage (nice UX when navigating)
  useEffect(() => {
    const cached = localStorage.getItem("wlai.plan");
    if (cached) setPlan(cached);
  }, []);
  useEffect(() => {
    localStorage.setItem("wlai.plan", plan || "");
  }, [plan]);

  async function onSave() {
    try {
      setSaving(true);
      setSaveMsg("");
      // Attempt to persist to your existing tables (best effort).
      const { data: { user } = { user: null } } = await supabase.auth.getUser();
      if (!user) {
        setSaveMsg("Saved locally. (Sign in to save to your account.)");
        return;
      }
      // Create or reuse a case
      const { data: caseRow, error: caseErr } = await supabase
        .from("cases")
        .upsert(
          { title: "Untitled Case", user_id: user.id },
          { onConflict: "title,user_id" }
        )
        .select()
        .limit(1)
        .single();

      if (caseErr) {
        setSaveMsg("Saved locally. (Supabase case write skipped.)");
        return;
      }

      const { error: docErr } = await supabase.from("documents").insert({
        case_id: caseRow.id,
        kind: "plan",
        content: plan,
      });

      if (docErr) {
        setSaveMsg("Saved locally. (Supabase doc write skipped.)");
      } else {
        setSaveMsg("Saved to your account.");
      }
    } catch {
      setSaveMsg("Saved locally.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 4000);
    }
  }

  async function onExport() {
    try {
      setExporting(true);
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format,
          presetId,
          title,
          text: plan,
          includeCertificate,
        }),
      });
      if (!res.ok) {
        const e = await res.text();
        alert("Export failed: " + e);
        return;
      }

      const blob = await res.blob();
      const filename =
        title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
        (format === "docx" ? ".docx" : ".md");

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "export";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: editor */}
      <div>
        <h1 className="text-2xl font-semibold mb-3">Plan (conversation)</h1>
        <textarea
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          placeholder="Start outlining what you want the pleading to say..."
          className="w-full min-h-[360px] rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/40 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-black text-white px-4 py-2 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save plan"}
          </button>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {saveMsg}
          </span>
        </div>
      </div>

      {/* Right: Export panel */}
      <div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
          <h2 className="text-xl font-semibold">Output layout</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Choose a format and a style preset. v1 supports DOCX and Markdown.
          </p>

          <div className="mt-5 space-y-4">
            <label className="block text-sm font-medium">
              Title (will enforce local rule suffix if needed)
            </label>
            <input
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/40 px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Motion to Dismiss"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/40 px-3 py-2"
                >
                  <option value="docx">DOCX (.docx)</option>
                  <option value="markdown">Markdown (.md)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Style preset</label>
                <select
                  value={presetId}
                  onChange={(e) => setPresetId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/40 px-3 py-2"
                >
                  {EXPORT_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="cert"
                type="checkbox"
                checked={includeCertificate}
                onChange={(e) => setIncludeCertificate(e.target.checked)}
              />
              <label htmlFor="cert" className="text-sm">
                Include certificate of service
              </label>
            </div>

            <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-3 text-xs">
              <div className="font-medium mb-1">Preset details</div>
              <div>Font: {preset.docx.font.name} {preset.docx.font.size}pt</div>
              <div>
                Margins (in): top {preset.docx.margins.top}, right {preset.docx.margins.right},
                bottom {preset.docx.margins.bottom}, left {preset.docx.margins.left}
              </div>
              <div>Line spacing: {preset.docx.line.multiple}×</div>
              {preset.docx.titleMustEndWith ? (
                <div>Title rule: must end with “{preset.docx.titleMustEndWith}”.</div>
              ) : null}
            </div>

            <button
              onClick={onExport}
              disabled={exporting || !plan.trim()}
              className="w-full rounded-lg bg-blue-600 text-white py-2.5 disabled:opacity-60"
            >
              {exporting ? "Exporting…" : "Export"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
