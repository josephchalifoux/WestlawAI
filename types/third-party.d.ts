// types/third-party.d.ts

// Minimal typings so TS will accept these libs.

declare module "pdf-parse" {
  export type PdfParseResult = {
    text?: string;
    [key: string]: any;
  };
  const pdfParse: (
    data: Buffer | Uint8Array | ArrayBuffer
  ) => Promise<PdfParseResult>;
  export default pdfParse;
}

declare module "mammoth" {
  export function extractRawText(input: {
    buffer: Buffer | Uint8Array | ArrayBuffer;
  }): Promise<{ value: string }>;
}
