import mdx from '@mdx-js/rollup';
import babel from '@rolldown/plugin-babel';
import rehypeShiki from '@shikijs/rehype';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';

import { remarkMermaid } from './tools/remark-mermaid.ts';
import { staticSeoPlugin } from './tools/seo/plugin-static-seo.ts';

const isAnalyze = process.env.ANALYZE === '1';
const siteUrl = process.env.VITE_SITE_URL ?? 'https://software-architecture.example.com';
const basePath = process.env.VITE_BASE_PATH ?? '/';

export default defineConfig({
  base: basePath,
  plugins: [
    tanstackRouter({ autoCodeSplitting: true, target: 'react' }),
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'append',
              content: { type: 'text', value: '#' },
              properties: { ariaHidden: 'true', className: ['heading-anchor'], tabIndex: -1 },
            },
          ],
          [
            rehypeShiki,
            {
              defaultColor: false,
              themes: { dark: 'github-dark-default', light: 'github-light-default' },
            },
          ],
        ],
        remarkPlugins: [
          remarkGfm,
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          remarkMermaid,
        ],
      }),
    },
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    compression({
      algorithms: ['brotliCompress', 'gzip'],
      exclude: [/\.(br|gz)$/],
      threshold: 1024,
    }),
    staticSeoPlugin({ siteUrl }),
    ...(isAnalyze
      ? [visualizer({ brotliSize: true, filename: 'reports/bundle.html', gzipSize: true })]
      : []),
  ],
  build: {
    modulePreload: { polyfill: false },
    reportCompressedSize: false,
    target: 'baseline-widely-available',
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
