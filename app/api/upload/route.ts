// app/api/upload/route.ts
export const runtime = "nodejs";

import pdfParse from "pdf-parse-debugging-disabled";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return new Response(JSON.stringify({ error: "No file uploaded" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const name = ((file as any)?.name ?? "").toLowerCase();
  const type = ((file as any)?.type ?? "").toLowerCase();

  // PDF
  if (name.endsWith(".pdf") || type === "application/pdf") {
    const result = await pdfParse(buf);
    return Response.json({ kind: "pdf", text: result?.text ?? "" });
  }

  // Plain text
  if (name.endsWith(".txt") || type.startsWith("text/")) {
    return Response.json({ kind: "text", text: buf.toString("utf8") });
  }

  // (Optional) DOCX hook — we can wire mammoth later
  if (name.endsWith(".docx")) {
    return Response.json({ kind: "docx", text: "" });
  }

  return Response.json({ kind: "unsupported" }, { status: 415 });
}
