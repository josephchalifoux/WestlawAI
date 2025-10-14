// app/api/upload/route.ts
export const runtime = "nodejs"; // PDF.js requires Node APIs

// We'll import PDF.js' ESM build dynamically to avoid bundler quirks.
// Using the legacy ESM build is recommended for older environments.
async function extractPdfText(buf: Buffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buf) });
  const pdf = await loadingTask.promise;

  let out = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const tc = await page.getTextContent();
    const pageText = (tc.items as any[])
      .map((it) => (typeof it.str === "string" ? it.str : ""))
      .join(" ");
    out += pageText + "\n";
  }
  return out.trim();
}

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return new Response("No file uploaded", { status: 400 });

  const name = ((file as any)?.name || "").toLowerCase();
  const type = ((file as any)?.type || "").toLowerCase();
  const buf = Buffer.from(await file.arrayBuffer());

  // PDF
  if (name.endsWith(".pdf") || type === "application/pdf") {
    try {
      const text = await extractPdfText(buf);
      return Response.json({ kind: "pdf", text });
    } catch (e: any) {
      return Response.json({ error: `PDF parse failed: ${e?.message || e}` }, { status: 500 });
    }
  }

  // TXT
  if (name.endsWith(".txt") || type.startsWith("text/")) {
    return Response.json({ kind: "txt", text: buf.toString("utf8") });
  }

  // For now, we’ll stub DOCX. (We can wire DOCX with Mammoth after deploy is green.)
  if (name.endsWith(".docx")) {
    return Response.json({
      kind: "docx",
      text: "",
      note: "DOCX parsing will be enabled after PDF deploy is stable."
    });
  }

  return new Response("Unsupported file type. Upload .pdf or .txt.", { status: 415 });
}
