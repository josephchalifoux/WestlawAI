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

const TWIPS_PER_INCH = 1440;
const inches = (n: number) => Math.round(n * TWIPS_PER_INCH);
const withExt = (title: string, ext: "docx" | "md") =>
  (title?.trim() || "Draft").toLowerCase().endsWith(`.${ext}`)
    ? title.trim()
    : `${(title || "Draft").trim()}.${ext}`;

export async function POST(req: NextRequest) {
  const { title = "Draft", content = "", format = "docx", presetId = DEFAULT_PRESET_ID } =
    (await req.json().catch(() => ({}))) || {};

  const preset = EXPORT_PRESETS.find((p) => p.id === presetId) ?? EXPORT_PRESETS[0];

  if (format === "markdown") {
    const filename = withExt(title, "md");
    return new Response(content || "", {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  const paras: Paragraph[] = [];
  const lines = (content || "").split(/\r?\n/);

  lines.forEach((line, i) => {
    const text = (line ?? "").replace(/\t/g, "    ");
    if (!text.trim()) {
      paras.push(new Paragraph({ text: "", spacing: { after: 200 } }));
    } else if (i === 0) {
      paras.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.LEFT,
          children: [new TextRun({ text, bold: true })],
          spacing: { after: 300 },
        })
      );
    } else {
      paras.push(
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
        children: paras,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const filename = withExt(title, "docx");

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buffer.byteLength),
    },
  });
}
