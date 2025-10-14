declare module "pdfjs-dist/legacy/build/pdf.mjs" {
  export function getDocument(src: any): { promise: Promise<any> };
  export const version: string;
}
