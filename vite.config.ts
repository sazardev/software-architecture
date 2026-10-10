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
import { VitePWA } from 'vite-plugin-pwa';

import { rehypeInternalLinks } from './tools/rehype-internal-links.ts';
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
          [rehypeInternalLinks, { base: basePath }],
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
    VitePWA({
      includeAssets: [
        'apple-touch-icon.png',
        'favicon.svg',
        'icons/icon-maskable.svg',
        'icons/icon.svg',
      ],
      manifest: {
        background_color: '#fafafa',
        categories: ['education', 'productivity', 'developer'],
        description:
          'Recursos ultra interactivos, diagramas vivos y documentación profunda para diseñar sistemas que escalan.',
        display: 'standalone',
        icons: [
          { sizes: '192x192', src: 'icons/icon-192.png', type: 'image/png' },
          { sizes: '512x512', src: 'icons/icon-512.png', type: 'image/png' },
          {
            purpose: 'maskable',
            sizes: '512x512',
            src: 'icons/icon-maskable-512.png',
            type: 'image/png',
          },
          { sizes: 'any', src: 'icons/icon.svg', type: 'image/svg+xml' },
        ],
        lang: 'es',
        name: 'Software Architecture',
        scope: '.',
        short_name: 'Software Arch.',
        start_url: '.',
        theme_color: '#4f46e5',
      },
      registerType: 'autoUpdate',
      workbox: {
        cleanupOutdatedCaches: true,
        globIgnores: ['**/404.html'],
        globPatterns: ['**/*.{js,css,html,svg,png,json,webmanifest}'],
        navigateFallback: 'index.html',
      },
    }),
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
