// app/api/upload/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return new Response("No file uploaded", { status: 400 });

    const name = (file.name || "").toLowerCase();
    const type = file.type || "";
    const buf = Buffer.from(await file.arrayBuffer());

    // DOCX
    if (name.endsWith(".docx") || type.includes("officedocument.wordprocessingml.document")) {
      const mammoth = (await import("mammoth")).default;
      const result = await mammoth.extractRawText({ buffer: buf });
      return Response.json({ kind: "docx", text: result.value || "" });
    }

    // PDF
    if (name.endsWith(".pdf") || type === "application/pdf") {
      const pdfParse = (await import("pdf-parse")).default as any;
      const out = await pdfParse(buf);
      return Response.json({ kind: "pdf", text: out?.text || "" });
    }

    // TXT or anything text/*
    if (name.endsWith(".txt") || type.startsWith("text/")) {
      return Response.json({ kind: "txt", text: buf.toString("utf8") });
    }

    return new Response("Unsupported file type. Upload .pdf, .docx, or .txt", { status: 415 });
  } catch (e: any) {
    return new Response(`Upload error: ${e?.message || e}`, { status: 500 });
  }
}
