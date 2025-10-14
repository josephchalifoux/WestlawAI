// app/api/upload/route.ts
export const runtime = "nodejs";

import pdfParse from "pdf-parse";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return new Response("No file provided", { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const name = (file as any)?.name ?? "";
  const type = (file as any)?.type ?? "";

  // PDF
  if (name.endsWith(".pdf") || type === "application/pdf") {
    const out = await pdfParse(buf);
    return Response.json({ kind: "pdf", text: out?.text ?? "" });
  }

  // TXT
  if (name.endsWith(".txt") || type === "text/plain") {
    return Response.json({ kind: "txt", text: buf.toString("utf8") });
  }

  // Basic DOCX fallback (optional; can be removed if you don’t want it)
  if (name.endsWith(".docx")) {
    try {
      const mammoth = await import("mammoth");
      const { value } = await mammoth.extractRawText({ buffer: buf });
      return Response.json({ kind: "docx", text: value ?? "" });
    } catch {
      return Response.json({ kind: "docx", text: "" });
    }
  }

  return Response.json({ kind: "unsupported" });
}
