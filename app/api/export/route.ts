// app/api/export/route.ts
export const runtime = "nodejs";

import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  PageOrientation,
} from "docx";

function inches(n: number) {
  return Math.round(n * 1440); // twips
}

type ExportFormat = "DOCX" | "PDF";
type PresetKey = "letter" | "legal" | "a4";

const presets: Record<
  PresetKey,
  { widthIn: number; heightIn: number; margins: { top: number; right: number; bottom: number; left: number } }
> = {
  letter: { widthIn: 8.5, heightIn: 11, margins: { top: 1, right: 1, bottom: 1, left: 1 } },
  legal:  { widthIn: 8.5, heightIn: 14, margins: { top: 1, right: 1, bottom: 1, left: 1 } },
  a4:     { widthIn: 8.27, heightIn: 11.69, margins: { top: 1, right: 1, bottom: 1, left: 1 } },
};

interface ExportBody {
  text?: string;           // the content we export
  format?: ExportFormat;   // "DOCX" | "PDF"
  preset?: PresetKey;      // "letter" | "legal" | "a4"
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as ExportBody;

  const text = body.text?.trim() ?? "No content provided.";
  const format: ExportFormat = (body.format ?? "DOCX").toUpperCase() as ExportFormat;
  const presetKey: PresetKey = (body.preset ?? "letter").toLowerCase() as PresetKey;

  const preset = presets[presetKey] ?? presets.letter;

  if (format === "PDF") {
    // (PDF pipeline will be added later.)
    return new Response(
      JSON.stringify({ ok: false, message: "PDF export coming next." }),
      { status: 501, headers: { "content-type": "application/json" } }
    );
  }

  // --- DOCX export ---
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: inches(preset.margins.top),
              right: inches(preset.margins.right),
              bottom: inches(preset.margins.bottom),
              left: inches(preset.margins.left),
            },
            size: {
              width: inches(preset.widthIn),
              height: inches(preset.heightIn),
              // ✅ orientation must be nested under size (or omit it to keep Portrait)
              orientation: PageOrientation.PORTRAIT,
            },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [],
            text,
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new Response(buffer, {
    status: 200,
    headers: {
      "content-type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": `attachment; filename="westlawai.docx"`,
      "cache-control": "no-store",
    },
  });
}
