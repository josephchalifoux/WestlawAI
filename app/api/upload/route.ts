// app/api/upload/route.ts
export const runtime = "nodejs";

// Toggle via env:
//   USE_EXTERNAL_PARSER=1 (server) or NEXT_PUBLIC_USE_EXTERNAL_PARSER=1 (client+server)
// Optional external endpoint:
//   PDF_PARSER_URL=https://your-parser.example.com/parse
const useExternal =
  process.env.USE_EXTERNAL_PARSER === "1" ||
  process.env.NEXT_PUBLIC_USE_EXTERNAL_PARSER === "1";
const parserURL = process.env.PDF_PARSER_URL || "";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return new Response("No file", { status: 400 });

  // If an external parser is enabled, forward the file.
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

  // Fallback: no server PDF dependency at build time.
  // We just echo metadata for now (keeps build green).
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
