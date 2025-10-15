// app/api/export/route.ts
export const runtime = "nodejs";

import { NextRequest } from "next/server";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  PageSize,
  Paragraph,
  TextRun,
} from "docx";
import { DEFAULT_PRESET_ID, EXPORT_PRESETS } from "../../../lib/export-presets";

// Helpers
const TWIPS_PER_INCH = 1440;
function inches(n: number) {
  return Math.round(n * TWIPS_PER_INCH);
}
function ensureSuffix(title: string, requiredExt: string) {
  const t = (title || "Draft").trim() || "Draft";
  return t.toLowerCase().endsWith(`.${requiredExt}`)
    ? t
    : `${t}.${requiredExt}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const {
    title = "Draft",
    content = "",
    format = "docx",
    presetId = DEFAULT_PRESET_ID,
  } = body || {};

  const preset = EXPORT_PRESETS.find((p) => p.id === presetId) ?? EXPORT_PRESETS[0];

  // Markdown path: return plain text with a filename header so the client can download directly
  if (format === "markdown") {
    const filename = ensureSuffix(title, "md");
    return new Response(content || "", {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  // DOCX path
  const blocks: Paragraph[] = [];

  // Very simple split: blank lines create spacing; first line becomes a heading.
  const lines = (content || "").split(/\r?\n/);
  lines.forEach((line, idx) => {
    const text = (line ?? "").replace(/\t/g, "    ");
    if (!text.trim()) {
      blocks.push(new Paragraph({ text: "", spacing: { after: 200 } }));
    } else if (idx === 0) {
      blocks.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.LEFT,
          children: [new TextRun({ text, bold: true })],
          spacing: { after: 300 },
        })
      );
    } else {
      blocks.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 120 },
          children: [new TextRun({ text })],
        })
      );
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size:
              preset.page.size === "LETTER"
                ? { width: PageSize.Letter.width, height: PageSize.Letter.height }
                : preset.page.size === "LEGAL"
                ? { width: PageSize.Legal.width, height: PageSize.Legal.height }
                : { width: PageSize.A4.width, height: PageSize.A4.height },
            margin: {
              top: inches(preset.page.margins.top),
              right: inches(preset.page.margins.right),
              bottom: inches(preset.page.margins.bottom),
              left: inches(preset.page.margins.left),
            },
          },
        },
        children: blocks,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const filename = ensureSuffix(title, "docx");

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buffer.byteLength),
    },
  });
}
