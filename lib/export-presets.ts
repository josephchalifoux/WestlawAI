// lib/export-presets.ts
// Export style presets for DOCX generation (margins in inches).

export type Preset = {
  id: string;
  label: string;
  docx: {
    page: "LETTER" | "A4";
    margins: { top: number; right: number; bottom: number; left: number };
    font: { name: string; size: number }; // size in points
    line: { multiple: number }; // 1 = single, 2 = double
    titleMustEndWith?: string; // e.g., 'and memorandum of law'
  };
};

export const EXPORT_PRESETS: Preset[] = [
  {
    id: "default_federal",
    label: "Federal (default)",
    docx: {
      page: "LETTER",
      margins: { top: 1, right: 1, bottom: 1, left: 1 },
      font: { name: "Times New Roman", size: 12 },
      line: { multiple: 2 },
      titleMustEndWith: "and memorandum of law",
    },
  },
  {
    id: "state_standard",
    label: "State Court (standard)",
    docx: {
      page: "LETTER",
      margins: { top: 1.0, right: 1.0, bottom: 1.0, left: 1.25 },
      font: { name: "Times New Roman", size: 12 },
      line: { multiple: 1.5 },
      titleMustEndWith: "and memorandum of law",
    },
  },
  {
    id: "compact_single",
    label: "Compact (single-spaced)",
    docx: {
      page: "LETTER",
      margins: { top: 0.8, right: 0.8, bottom: 0.8, left: 1.0 },
      font: { name: "Georgia", size: 11 },
      line: { multiple: 1.0 },
    },
  },
];

export const DEFAULT_PRESET_ID = "default_federal";
