// app/api/upload/route.ts
// Node runtime required for Buffer-based parsers
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import pdfParse from "pdf-parse";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  const name = (file.name || "").toLowerCase();
  const type = (file.type || "").toLowerCase();
  const buf = Buffer.from(await file.arrayBuffer());

  // PDF
  if (name.endsWith(".pdf") || type === "application/pdf") {
    const out = await pdfParse(buf as any);
    return Response.json({ kind: "pdf", text: out?.text ?? "" });
  }

  // DOCX
  if (
    name.endsWith(".docx") ||
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const mammoth = await import("mammoth");
    const out = await mammoth.extractRawText({ buffer: buf });
    return Response.json({ kind: "docx", text: out?.value ?? "" });
  }

  // TXT or other text/*
  if (name.endsWith(".txt") || type.startsWith("text/")) {
    return Response.json({ kind: "txt", text: buf.toString("utf8") });
  }

  return Response.json({ error: "Unsupported file type. Upload .pdf, .docx, or .txt" }, { status: 415 });
}
