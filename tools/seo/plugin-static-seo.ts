import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { Plugin } from 'vite';

type StaticSeoOptions = {
  siteUrl: string;
};

type ContentIndexShape = {
  docs: { route: string; updatedAt: string }[];
};

type SitemapEntry = {
  lastmod: string | undefined;
  loc: string;
  priority: string;
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function staticSeoPlugin(options: StaticSeoOptions): Plugin {
  let outDir = 'dist';

  return {
    apply: 'build',
    async closeBundle() {
      const base = options.siteUrl.replace(/\/+$/, '');
      const index = JSON.parse(
        await readFile('src/content/index.gen.json', 'utf8'),
      ) as ContentIndexShape;

      const entries: SitemapEntry[] = [
        { lastmod: undefined, loc: `${base}/`, priority: '1.0' },
        { lastmod: undefined, loc: `${base}/docs`, priority: '0.8' },
        ...index.docs.map((doc) => ({
          lastmod: doc.updatedAt,
          loc: `${base}${doc.route}`,
          priority: '0.6',
        })),
      ];

      const urls = entries
        .map((entry) => {
          const lastmod =
            entry.lastmod === undefined ? '' : `\n    <lastmod>${entry.lastmod}</lastmod>`;
          return `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>${lastmod}\n    <priority>${entry.priority}</priority>\n  </url>`;
        })
        .join('\n');

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
      const robots = `User-agent: *\nAllow: /\nDisallow: /search\n\nSitemap: ${base}/sitemap.xml\n`;

      await writeFile(join(outDir, 'sitemap.xml'), sitemap, 'utf8');
      await writeFile(join(outDir, 'robots.txt'), robots, 'utf8');

      const indexHtml = await readFile(join(outDir, 'index.html'));
      await writeFile(join(outDir, '404.html'), indexHtml);
      await writeFile(join(outDir, '.nojekyll'), '');
    },
    configResolved(config) {
      outDir = config.build.outDir;
    },
    name: 'static-seo',
  };
}
