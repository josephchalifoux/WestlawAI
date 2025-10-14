declare module "pdf-parse" {
  export interface PDFParseResult {
    text: string;
    numpages?: number;
    numrender?: number;
    info?: unknown;
    metadata?: unknown;
    version?: string;
  }

  type PDFData = Buffer | Uint8Array | ArrayBuffer;

  // pdf-parse is CommonJS; Next/TS will synthesize default with esModuleInterop
  function pdfParse(data: PDFData, options?: unknown): Promise<PDFParseResult>;
  export default pdfParse;
}
