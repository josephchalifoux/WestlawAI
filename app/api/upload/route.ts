export const runtime = "nodejs"; // pdf.js is Node-only

// Minimal text extraction with Mozilla pdf.js on the server.
// No worker is used; we run in "legacy" build that works under Node.
async function extractTextFromPdf(buf: Buffer): Promise<string> {
  // Dynamic import keeps webpack happy and avoids edge bundling.
  const pdfjs = (await import("pdfjs-dist/legacy/build/pdf.mjs")) as any;

  // Options disable features that aren't needed server-side.
  const loading = pdfjs.getDocument({
    data: new Uint8Array(buf),
    useWorkerFetch: false,
    isEvalSupported: false,
    disableFontFace: true
  });

  const doc = await loading.promise;
  let out = "";

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const textContent = await page.getTextContent();
    // textContent.items is an array of glyph objects; pick .str where present
    const line = textContent.items
      .map((it: any) => (typeof it?.str === "string" ? it.str : ""))
      .join(" ");
    out += line + "\n";
  }

  try { await doc.destroy?.(); } catch {}
  return out.trim();
}

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return new Response("No file", { status: 400 });

  const name = (file as any)?.name ?? "";
  const type = (file as any)?.type ?? "";
  const buf = Buffer.from(await file.arrayBuffer());

  // Only handle PDFs for now
  if (name.toLowerCase().endsWith(".pdf") || type === "application/pdf") {
    try {
      const text = await extractTextFromPdf(buf);
      return Response.json({ kind: "pdf", text });
    } catch (err) {
      console.error("PDF parse failed:", err);
      return new Response("Parse failed", { status: 502 });
    }
  }

  return Response.json({ kind: "unsupported" });
}
