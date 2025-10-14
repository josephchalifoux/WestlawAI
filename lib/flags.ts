// lib/flags.ts
export const flags = {
  // Browser hint (optional)
  useExternalParserPublic:
    process.env.NEXT_PUBLIC_USE_EXTERNAL_PARSER === '1',

  // Server switch (authoritative)
  useExternalParser:
    String(process.env.USE_EXTERNAL_PARSER || '').toLowerCase() === 'true',
};
