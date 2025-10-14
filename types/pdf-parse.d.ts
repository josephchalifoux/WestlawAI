// types/pdf-parse.d.ts
declare module "pdf-parse" {
  export interface PDFParseResult {
    text: string;
    numpages?: number;
    numrender?: number;
    info?: any;
    metadata?: any;
    version?: string;
  }

  type Data = Buffer | Uint8Array | ArrayBuffer;

  function pdfParse(data: Data, options?: any): Promise<PDFParseResult>;

  // CommonJS default export
  export default pdfParse;
}
