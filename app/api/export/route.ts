// app/api/export/route.ts
export async function POST(req: Request) {
  const { text, layout, format } = await req.json();

  const lines = [
    "WestlawAI — Export (stub)",
    `Format: ${format}`,
    `Font: ${layout?.font}, Size: ${layout?.size}, Margin: ${layout?.margin}in, Caption: ${layout?.caption}`,
    "",
    "---- Content ----",
    String(text || ""),
  ];

  const body = lines.join("\n");
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": `attachment; filename="westlawai-export.txt"`,
    },
  });
}
