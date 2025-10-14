// types/third-party.d.ts
declare module "mammoth" {
  export function extractRawText(input: { buffer: any }): Promise<{ value: string }>;
}
