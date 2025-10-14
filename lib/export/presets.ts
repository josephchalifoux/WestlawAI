// lib/export/presets.ts
export type ExportFormat = "docx" | "pdf";

export type Preset = {
  id: string;
  label: string;
  fontFamily: string;
  fontSize: number;      // in points
  lineSpacing: number;   // 1.0 = single, 1.5 = one-and-a-half, 2.0 = double
  margins: { top: number; right: number; bottom: number; left: number }; // in inches
  caption?: { enabled: boolean; text?: string; align?: "left" | "center" | "right" };
  header?: { enabled: boolean; text?: string; align?: "left" | "center" | "right" };
};

export const PRESETS: Preset[] = [
  {
    id: "std-11pt",
    label: "Standard (11pt, 1\" margins)",
    fontFamily: "Times New Roman",
    fontSize: 11,
    lineSpacing: 1.15,
    margins: { top: 1, right: 1, bottom: 1, left: 1 },
    header: { enabled: false },
    caption: { enabled: false }
  },
  {
    id: "court-fl-12pt-double",
    label: "Florida Court (12pt, double)",
    fontFamily: "Times New Roman",
    fontSize: 12,
    lineSpacing: 2.0,
    margins: { top: 1, right: 1, bottom: 1, left: 1 },
    header: { enabled: true, text: "IN THE CIRCUIT COURT ...", align: "center" },
    caption: { enabled: true, text: "Case No.: [auto]", align: "left" }
  },
  {
    id: "federal-12pt",
    label: "Federal (12pt, 1\" margins)",
    fontFamily: "Times New Roman",
    fontSize: 12,
    lineSpacing: 1.5,
    margins: { top: 1, right: 1, bottom: 1, left: 1 }
  }
];

export function getPreset(id?: string): Preset {
  const found = PRESETS.find(p => p.id === id);
  return found ?? PRESETS[0];
}
