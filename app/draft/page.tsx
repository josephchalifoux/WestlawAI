// app/draft/page.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Simple “court style” suggestions (MVP)
const COURT_PRESETS: Record<
  string,
  { font: string; size: number; margin: number; caption: string }
> = {
  default: { font: "Times New Roman", size: 12, margin: 1.0, caption: "Standard" },
  florida: { font: "Times New Roman", size: 12, margin: 1.0, caption: "Florida Standard" },
  federal: { font: "Times New Roman", size: 12, margin: 1.0, caption: "Federal Rule Style" },
};

export default function DraftPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [plan, setPlan] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [court, setCourt] = useState("default");

  // Layout presets
  const [font, setFont] = useState("Times New Roman");
  const [size, setSize] = useState(12);
  const [margin, setMargin] = useState(1.0);
  const [caption, setCaption] = useState("Standard");
  const [format, setFormat] = useState<"PDF" | "DOCX">("PDF");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const layout = useMemo(
    () => ({ font, size, margin, caption, format }),
    [font, size, margin, caption, format]
  );

  function suggestByCourt() {
    const key = court.toLowerCase().includes("fed")
      ? "federal"
      : court.toLowerCase().includes("florida")
      ? "florida"
      : "default";
    const p = COURT_PRESETS[key];
    setFont(p.font);
    setSize(p.size);
    setMargin(p.margin);
    setCaption(p.caption);
  }

  async function ensureCase(): Promise<string> {
    const { data: cases, error } = await supabase
      .from("cases")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1);
    if (error) throw error;
    if (cases && cases.length) return cases[0].id;

    const { data: ins, error: insErr } = await supabase
      .from("cases")
      .insert([{ title: "Default Case", user_id: userId }])
      .select("id")
      .single();
    if (insErr) throw insErr;
    return ins.id;
  }

  async function onSavePlan() {
    if (!userId) {
      setMsg("Please sign in first.");
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const caseId = await ensureCase();
      const payload = {
        user_id: userId,
        case_id: caseId,
        kind: "plan",
        title: "Planning Session",
        content: { text: plan, layout },
      };
      const { error } = await supabase.from("documents").insert([payload]);
      if (error) throw error;
      setMsg("Saved to your account.");
    } catch (e: any) {
      setMsg(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onExportStub() {
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: plan, layout, format }),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = format === "PDF" ? "westlawai-export.pdf.txt" : "westlawai-export.docx.txt";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setMsg("Export stub failed");
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 py-10 grid grid-cols-1 gap-10 md:grid-cols-12">
      <div className="md:col-span-8">
        <h1 className="text-2xl font-semibold tracking-tight">Plan (conversation)</h1>
        <textarea
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          rows={12}
          placeholder="Describe the matter, claims, defenses, goals, & constraints…"
          className="mt-4 w-full rounded-xl border border-zinc-300 p-4 outline-none focus:ring-2 focus:ring-zinc-900"
        />
        <button
          onClick={onSavePlan}
          disabled={saving}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-900 px-5 py-2 text-sm font-medium hover:bg-zinc-900 hover:text-white transition-colors disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save plan"}
        </button>
        {msg && <p className="mt-3 text-sm text-zinc-700">{msg}</p>}
      </div>

      <aside className="md:col-span-4">
        <div className="rounded-2xl border border-zinc-200 p-4">
          <h2 className="text-base font-semibold tracking-tight">Output layout</h2>
          <p className="mt-1 text-sm text-zinc-700">Presets coming next. Export is stubbed for now.</p>

          <div className="mt-4 space-y-3 text-sm">
            <label className="block">
              <span className="text-zinc-700">Court / Judge (for suggestions)</span>
              <input
                value={court}
                onChange={(e) => setCourt(e.target.value)}
                placeholder="e.g., Florida Circuit, Judge Smith"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </label>
            <button
              onClick={suggestByCourt}
              className="rounded-full border border-zinc-900 px-4 py-2 font-medium hover:bg-zinc-900 hover:text-white transition-colors"
            >
              Suggest by court
            </button>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-zinc-700">Font</span>
                <select value={font} onChange={(e) => setFont(e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2">
                  <option>Times New Roman</option>
                  <option>Arial</option>
                  <option>Calibri</option>
                </select>
              </label>
              <label className="block">
                <span className="text-zinc-700">Size</span>
                <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2">
                  <option value={11}>11</option>
                  <option value={12}>12</option>
                  <option value={14}>14</option>
                </select>
              </label>
              <label className="block">
                <span className="text-zinc-700">Margins (inches)</span>
                <select value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2">
                  <option value={1.0}>1.0</option>
                  <option value={1.25}>1.25</option>
                  <option value={1.5}>1.5</option>
                </select>
              </label>
              <label className="block">
                <span className="text-zinc-700">Caption</span>
                <select value={caption} onChange={(e) => setCaption(e.target.value)} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2">
                  <option>Standard</option>
                  <option>Florida Standard</option>
                  <option>Federal Rule Style</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-zinc-700">Format</span>
              <select value={format} onChange={(e) => setFormat(e.target.value as any)} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2">
                <option>PDF</option>
                <option>DOCX</option>
              </select>
            </label>

            <button
              onClick={onExportStub}
              className="mt-3 w-full rounded-full border border-zinc-900 px-4 py-2 font-medium hover:bg-zinc-900 hover:text-white transition-colors"
            >
              Export (stub)
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
