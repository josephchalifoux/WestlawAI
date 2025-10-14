// app/api/upload/route.ts
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Expect a multipart/form-data with field "file"
  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  const name = file.name || "";
  const type = (file.type as string) || "";
  const buf = Buffer.from(await file.arrayBuffer());

  // PDF
  if (name.endsWith(".pdf") || type === "application/pdf") {
    // @ts-ignore - no official types available for 'pdf-parse'
    const pdfParse = (await import("pdf-parse")).default as any;
    const out = await pdfParse(buf);
    return Response.json({ kind: "pdf", text: out?.text || "" });
  }

  // DOCX
  if (
    name.endsWith(".docx") ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    // @ts-ignore - no official types available for 'mammoth'
    const mammoth = (await import("mammoth")) as any;
    const out = await mammoth.extractRawText({ buffer: buf });
    return Response.json({ kind: "docx", text: out?.value || "" });
  }

  // Fallback: treat as utf-8 text
  return Response.json({ kind: "text", text: buf.toString("utf8") });
}
