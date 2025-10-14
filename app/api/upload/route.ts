export const runtime = "nodejs";

import pdfParse from "pdf-parse";

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
  const name = (file as any)?.name ?? "";
  const type = (file as any)?.type ?? "";

  // PDF only for now
  if (name.endsWith(".pdf") || type === "application/pdf") {
    const result = await pdfParse(buf);
    return Response.json({
      kind: "pdf",
      text: result?.text ?? ""
    });
  }

  return Response.json({ kind: "unsupported" });
}
