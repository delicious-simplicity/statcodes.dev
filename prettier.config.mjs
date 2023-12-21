// @ts-check

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions & import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
const config = {
  importOrder: [
    '',
    '<BUILTIN_MODULES>',
    '',
    '^react$',
    '^react-dom$',
    '^next$',
    '^next/*',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '~/*',
    '',
    '^[.]', // relative imports
    '',
    '^(?!.*[.]css$)[./].*$',
    '.css$',
  ],
  importOrderParserPlugins: ['typescript', 'jsx'],
  importOrderTypeScriptVersion: '5.0.0',
  jsxSingleQuote: true,
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tailwindFunctions: ['cn', 'cva'],
  trailingComma: 'all',
};

export default config;
