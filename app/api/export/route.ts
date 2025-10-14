// app/api/export/route.ts
export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { getPreset, type ExportFormat } from "../../../lib/export/presets";
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, PageOrientation } from "docx";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type Block = { type: "heading" | "paragraph"; text: string };
type ExportBody = {
  title?: string;
  presetId?: string;
  format?: ExportFormat; // "docx" | "pdf"
  blocks?: Block[];      // simple linear blocks for v1
};

function inches(n: number) {
  // docx expects TWIP (twentieth of a point). 1 inch = 72 pt = 1440 twip
  return n * 1440;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ExportBody;
    const preset = getPreset(body.presetId);
    const format: ExportFormat = body.format ?? "docx";
    const title = body.title?.trim() || "Pleading";
    const blocks: Block[] = body.blocks?.length
      ? body.blocks
      : [{ type: "heading", text: title }, { type: "paragraph", text: "…" }];

    if (format === "docx") {
      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: inches(preset.margins.top),
                  right: inches(preset.margins.right),
                  bottom: inches(preset.margins.bottom),
                  left: inches(preset.margins.left)
                },
                orientation: PageOrientation.PORTRAIT
              }
            },
            children: [
              // optional header/caption (lightweight v1)
              ...(preset.header?.enabled && preset.header.text
                ? [
                    new Paragraph({
                      alignment:
                        preset.header.align === "center"
                          ? AlignmentType.CENTER
                          : preset.header.align === "right"
                          ? AlignmentType.RIGHT
                          : AlignmentType.LEFT,
                      children: [
                        new TextRun({
                          text: preset.header.text,
                          bold: true,
                          size: preset.fontSize * 2
                        })
                      ]
                    })
                  ]
                : []),

              ...(preset.caption?.enabled && preset.caption.text
                ? [
                    new Paragraph({
                      spacing: { after: 200 },
                      children: [
                        new TextRun({
                          text: preset.caption.text,
                          italics: true,
                          size: preset.fontSize * 2
                        })
                      ]
                    })
                  ]
                : []),

              // content blocks
              ...blocks.map((b) => {
                const base = {
                  spacing: { line: preset.lineSpacing * 240 }, // 240 = single
                  children: [
                    new TextRun({
                      text: b.text,
                      size: preset.fontSize * 2,
                      font: preset.fontFamily
                    })
                  ]
                };

                if (b.type === "heading") {
                  return new Paragraph({
                    ...base,
                    alignment: AlignmentType.CENTER,
                    heading: HeadingLevel.TITLE,
                    spacing: { after: 240, line: preset.lineSpacing * 240 },
                    children: [
                      new TextRun({
                        text: b.text,
                        bold: true,
                        size: (preset.fontSize + 2) * 2,
                        font: preset.fontFamily
                      })
                    ]
                  });
                }

                return new Paragraph(base);
              })
            ]
          }
        ]
      });

      const buf = await Packer.toBuffer(doc);
      return new Response(buf, {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${title.replace(/\s+/g, "_")}.docx"`
        }
      });
    }

    // Simple PDF using pdf-lib (layout-aware v2 can follow later)
    const pdf = await PDFDocument.create();
    const page = pdf.addPage([612, 792]); // Letter
    const font = await pdf.embedFont(StandardFonts.TimesRoman);
    const { width } = page.getSize();

    const left = 72 * preset.margins.left;
    const right = 72 * preset.margins.right;
    const top = 792 - 72 * preset.margins.top;
    const maxWidth = width - left - right;

    let y = top;

    const drawWrapped = (text: string, size: number, bold = false) => {
      const words = text.split(/\s+/);
      let line = "";
      const lineHeight = size * preset.lineSpacing * 1.2;

      for (const w of words) {
        const trial = line ? `${line} ${w}` : w;
        const trialWidth = font.widthOfTextAtSize(trial, size);
        if (trialWidth > maxWidth) {
          page.drawText(line, {
            x: left,
            y,
            size,
            font,
            color: rgb(0, 0, 0)
          });
          y -= lineHeight;
          line = w;
        } else {
          line = trial;
        }
      }
      if (line) {
        page.drawText(line, { x: left, y, size, font, color: rgb(0, 0, 0) });
        y -= lineHeight;
      }
    };

    // simple header/caption
    if (preset.header?.enabled && preset.header.text) {
      drawWrapped(preset.header.text, preset.fontSize + 2, true);
      y -= 6;
    }
    if (preset.caption?.enabled && preset.caption.text) {
      drawWrapped(preset.caption.text, preset.fontSize, false);
      y -= 6;
    }

    for (const b of blocks) {
      if (b.type === "heading") {
        drawWrapped(b.text, preset.fontSize + 2, true);
        y -= 6;
      } else {
        drawWrapped(b.text, preset.fontSize, false);
      }
    }

    const bytes = await pdf.save();
    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${title.replace(/\s+/g, "_")}.pdf"`
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Export failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
