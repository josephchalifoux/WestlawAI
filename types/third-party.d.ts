// types/third-party.d.ts
// Minimal declaration stubs so TypeScript will compile on Vercel.

declare module "pdf-parse" {
  // pdf-parse returns a Promise with at least a `text` field; keep the rest as any.
  const pdfParse: (data: Buffer | Uint8Array, options?: any) => Promise<{ text: string } & any>;
  export default pdfParse;
}

declare module "mammoth" {
  const mammoth: {
    extractRawText: (input: { buffer: Buffer } | { path: string }, options?: any) => Promise<{ value: string }>;
  };
  export default mammoth;
}
