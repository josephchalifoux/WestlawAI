// app/api/export/route.ts
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
import { DEFAULT_PRESET_ID, EXPORT_PRESETS } from "@/lib/export-presets";

// Helpers
const inches = (n: number) => Math.round(n * 1440); // DOCX uses twips (1/20 pt) = 1440 per inch

function ensureSuffix(title: string, required?: string) {
  if (!required) return title.trim();
  const t = title.trim();
  const req = required.toLowerCase();
  return t.toLowerCase().endsWith(req) ? t : `${t} ${required}`.trim();
}

function toParagraphs(text: string, fontName: string, fontSize: number, lineMultiple: number) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  return lines.map((line) => {
    // simple bullets if line starts with "- " or "* "
    const bullet =
      line.trimStart().startsWith("- ") || line.trimStart().startsWith("* ");
    const content = bullet ? line.trimStart().slice(2) : line;

    return new Paragraph({
      text: content,
      bullet: bullet ? { level: 0 } : undefined,
      spacing: { line: lineMultiple * 240 }, // 240 = single line
      children: [
        new TextRun({
          text: content,
          font: fontName,
          size: fontSize * 2, // docx size is half-points
        }),
      ],
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const format = (body?.format as "docx" | "markdown") ?? "docx";
    const presetId = (body?.presetId as string) ?? DEFAULT_PRESET_ID;

    const text: string = body?.text ?? "";
    const titleRaw: string = body?.title ?? "Untitled";
    const includeCertificate: boolean = !!body?.includeCertificate;

    const preset = EXPORT_PRESETS.find((p) => p.id === presetId) ?? EXPORT_PRESETS[0];
    const title = ensureSuffix(titleRaw, preset.docx.titleMustEndWith);

    if (format === "markdown") {
      const md = `# ${title}\n\n${text}\n${
        includeCertificate
          ? `\n---\n**Certificate of Service.** I certify that a true and correct copy of the foregoing was served on all parties via e-service on ${new Date()
              .toISOString()
              .slice(0, 10)}.`
          : ""
      }\n`;
      return new Response(md, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="${title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")}.md"`,
        },
      });
    }

    // DOCX
    const { margins, font, line, page } = preset.docx;

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: page === "A4" ? PageSize.A4 : PageSize.LETTER,
              margin: {
                top: inches(margins.top),
                right: inches(margins.right),
                bottom: inches(margins.bottom),
                left: inches(margins.left),
              },
            },
          },
          children: [
            new Paragraph({
              text: title,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { line: line.multiple * 240, after: 200 },
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  font: font.name,
                  size: font.size * 2,
                }),
              ],
            }),
            ...toParagraphs(text, font.name, font.size, line.multiple),
            ...(includeCertificate
              ? [
                  new Paragraph({ text: "", pageBreakBefore: true }),
                  new Paragraph({
                    text: "Certificate of Service",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { line: line.multiple * 240, after: 200 },
                    alignment: AlignmentType.LEFT,
                    children: [
                      new TextRun({
                        text: "Certificate of Service",
                        bold: true,
                        font: font.name,
                        size: font.size * 2,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text:
                          "I certify that a true and correct copy of the foregoing was served on all parties via e-service on " +
                          new Date().toLocaleDateString() +
                          ".",
                        font: font.name,
                        size: font.size * 2,
                      }),
                    ],
                    spacing: { line: line.multiple * 240 },
                  }),
                ]
              : []),
          ],
        },
      ],
    });

    const buf = await Packer.toBuffer(doc);

    const safe = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return new Response(buf, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${safe}.docx"`,
      },
    });
  } catch (err: any) {
    console.error("Export error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to export", detail: String(err?.message || err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
