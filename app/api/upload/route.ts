export const runtime = "nodejs"; // pdf-parse is Node-only

import pdfParse from "pdf-parse";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "Missing file 'file' in form data." }, { status: 400 });
    }

    const name = (file as any).name || "";
    const type = (file as any).type || "";

    // Read file into a Node buffer
    const buf = Buffer.from(await file.arrayBuffer());

    // --- PDF ---
    if (name.toLowerCase().endsWith(".pdf") || type === "application/pdf") {
      const out = await pdfParse(buf);
      return Response.json({ kind: "pdf", text: out?.text ?? "" });
    }

    // --- Plain text ---
    if (name.toLowerCase().endsWith(".txt") || type === "text/plain") {
      const text = new TextDecoder().decode(buf);
      return Response.json({ kind: "txt", text });
    }

    return Response.json({ kind: "unsupported", message: "Only PDF and TXT supported in this stub." }, { status: 415 });
  } catch (err: any) {
    return Response.json({ error: err?.message || "Upload failed" }, { status: 500 });
  }
}
