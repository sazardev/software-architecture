import type { Config } from 'prettier';

const config: Config = {
  printWidth: 100,
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  arrowParens: 'always',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/styles/index.css',
  tailwindFunctions: ['cn', 'cva'],
  overrides: [
    {
      files: '*.mdx',
      options: {
        proseWrap: 'preserve',
      },
    },
  ],
};

export default config;
