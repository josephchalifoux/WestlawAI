// app/api/upload/route.ts
export const runtime = "nodejs";

import pdfParse from "pdf-parse";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return new Response("No file", { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const name = (file as any)?.name ?? "";
  const type = (file as any)?.type ?? "";

  // PDF
  if (name.endsWith(".pdf") || type === "application/pdf") {
    const out = await pdfParse(buf);
    return Response.json({ kind: "pdf", text: out?.text ?? "" });
  }

  // Plain text
  if (type.startsWith("text/")) {
    const text = buf.toString("utf8");
    return Response.json({ kind: "text", text });
  }

  // DOCX is stubbed for now
  if (name.endsWith(".docx")) {
    return Response.json({ kind: "docx", text: "" });
  }

  return Response.json({ kind: "unsupported" });
}
