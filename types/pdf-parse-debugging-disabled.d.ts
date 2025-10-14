// types/pdf-parse-debugging-disabled.d.ts
declare module "pdf-parse-debugging-disabled" {
  export interface PDFParseResult {
    text: string;
    numpages?: number;
    numrender?: number;
    info?: unknown;
    metadata?: unknown;
    version?: string;
  }

  type PDFData = Buffer | Uint8Array | ArrayBuffer;

  function pdfParse(data: PDFData, options?: unknown): Promise<PDFParseResult>;
  export default pdfParse;
}
