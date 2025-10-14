// types/mammoth.d.ts
declare module "mammoth" {
  export function extractRawText(input: { buffer: Buffer | Uint8Array | ArrayBuffer }, options?: any): Promise<{ value: string }>;
}
