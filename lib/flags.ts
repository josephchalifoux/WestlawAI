export const flags = {
  // Either client-safe or server-only envs will work:
  //  - NEXT_PUBLIC_USE_EXTERNAL_PARSER (1/true) for UI hints
  //  - USE_EXTERNAL_PARSER (true) for server logic
  useExternalParser:
    process.env.NEXT_PUBLIC_USE_EXTERNAL_PARSER === '1' ||
    String(process.env.USE_EXTERNAL_PARSER).toLowerCase() === 'true',
};
