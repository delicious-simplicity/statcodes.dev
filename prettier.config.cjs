/** @type {import('prettier').Config} */
module.exports = {
  jsxSingleQuote: true,
  plugins: ['prettier-plugin-tailwindcss'],
  pluginSearchDirs: false,
  printWidth: 120,
  singleQuote: true,
  tailwindConfig: 'tailwind.config.ts',
  tailwindFunctions: ['cn', 'cva'],
  trailingComma: 'all',
};
