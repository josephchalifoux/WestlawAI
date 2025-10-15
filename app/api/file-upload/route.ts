// app/api/file-upload/route.ts
export const runtime = "nodejs";

// Feature flag + endpoint
const useExternal =
  process.env.USE_EXTERNAL_PARSER === "1" ||
  process.env.NEXT_PUBLIC_USE_EXTERNAL_PARSER === "1";
const parserURL = process.env.PDF_PARSER_URL || "";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return new Response("No file", { status: 400 });

  if (useExternal && parserURL) {
    const fd = new FormData();
    fd.append("file", file, (file as any)?.name || "upload.pdf");

    const r = await fetch(parserURL, { method: "POST", body: fd });
    if (!r.ok) return new Response("Parse failed", { status: 502 });

    const data = await r.json(); // expect { text: string }
    return Response.json({
      kind: "pdf",
      text: data?.text ?? "",
      source: "external",
    });
  }

  const name = (file as any)?.name ?? "";
  const type = (file as any)?.type ?? "";
  const size = (file as any)?.size ?? 0;

  return Response.json({
    kind: type.includes("pdf") ? "pdf" : "file",
    name,
    type,
    size,
    text: "",
    source: "stub",
  });
}
