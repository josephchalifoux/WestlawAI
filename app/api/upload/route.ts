// app/api/upload/route.ts
export const runtime = "nodejs";

/**
 * v1 upload:
 * - Accepts a file via multipart/form-data (field: "file")
 * - If it's .txt, returns its text (so you can test end-to-end)
 * - If it's PDF or anything else, returns a stub — no server parsing yet
 *   (we’ll plug in external OCR/parse behind a flag later)
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return new Response("No file", { status: 400 });

  const name = ((file as any)?.name ?? "").toLowerCase();
  const type = (file as any)?.type ?? "";

  // Simple .txt path to prove the pipeline works:
  if (name.endsWith(".txt") || type.startsWith("text/")) {
    const text = await file.text();
    return Response.json({ kind: "text", text });
  }

  // v1: do NOT parse PDFs here (no pdfjs-dist, no pdf-parse).
  // We’ll route PDFs to an external OCR/parse service later via a feature flag.
  if (name.endsWith(".pdf") || type === "application/pdf") {
    return Response.json({ kind: "pdf", text: "" }); // stub
  }

  return Response.json({ kind: "unsupported" });
}
