import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { Plugin } from 'vite';

type StaticSeoOptions = {
  siteUrl: string;
};

type ContentIndexEntry = {
  locale: string;
  route: string;
  slug: string;
  updatedAt: string;
};

type LocalesConfig = {
  default: string;
  locales: { code: string }[];
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function alternateLinks(alternates: Map<string, string>, defaultLocale: string): string {
  const links: string[] = [];

  for (const [code, href] of alternates) {
    links.push(`    <xhtml:link href="${escapeXml(href)}" hreflang="${code}" rel="alternate"/>`);
  }

  const xDefault = alternates.get(defaultLocale);

  if (xDefault !== undefined) {
    links.push(
      `    <xhtml:link href="${escapeXml(xDefault)}" hreflang="x-default" rel="alternate"/>`,
    );
  }

  return links.join('\n');
}

function sitemapUrl(
  alternates: Map<string, string>,
  defaultLocale: string,
  priority: string,
  lastmod?: string,
): string {
  const lastmodLine = lastmod === undefined ? '' : `\n    <lastmod>${lastmod}</lastmod>`;
  const links = alternateLinks(alternates, defaultLocale);
  const urls: string[] = Array.from(
    alternates.values(),
    (loc) =>
      `  <url>\n    <loc>${escapeXml(loc)}</loc>\n${links}${lastmodLine}\n    <priority>${priority}</priority>\n  </url>`,
  );

  return urls.join('\n');
}

function buildDocUrls(docs: ContentIndexEntry[], base: string, defaultLocale: string): string[] {
  const bySlug = new Map<string, Map<string, ContentIndexEntry>>();

  for (const doc of docs) {
    const group = bySlug.get(doc.slug) ?? new Map<string, ContentIndexEntry>();
    group.set(doc.locale, doc);
    bySlug.set(doc.slug, group);
  }

  const slugs: string[] = [...bySlug.keys()];

  slugs.sort((a, b) => a.localeCompare(b));

  const results: string[] = [];

  for (const slug of slugs) {
    const group = bySlug.get(slug);

    if (group === undefined) {
      continue;
    }

    const alternates = new Map<string, string>();
    let lastmod: string | undefined;

    for (const [code, entry] of group) {
      alternates.set(code, `${base}${entry.route}`);

      if (lastmod === undefined || entry.updatedAt > lastmod) {
        lastmod = entry.updatedAt;
      }
    }

    results.push(sitemapUrl(alternates, defaultLocale, '0.6', lastmod));
  }

  return results;
}

export function staticSeoPlugin(options: StaticSeoOptions): Plugin {
  let outDir = 'dist';

  return {
    apply: 'build',
    async closeBundle() {
      const base = options.siteUrl.replace(/\/+$/, '');
      const index = JSON.parse(await readFile('src/content/index.gen.json', 'utf8')) as {
        docs: ContentIndexEntry[];
      };
      const localeConfig = JSON.parse(
        await readFile('src/lib/i18n/locales.json', 'utf8'),
      ) as LocalesConfig;
      const codes = localeConfig.locales.map((definition) => definition.code);

      const homeAlternates = new Map(
        codes.map((code) => [code, `${base}/${code}`] as [string, string]),
      );
      const docsAlternates = new Map(
        codes.map((code) => [code, `${base}/${code}/docs`] as [string, string]),
      );

      const entries = [
        sitemapUrl(homeAlternates, localeConfig.default, '1.0'),
        sitemapUrl(docsAlternates, localeConfig.default, '0.8'),
        ...buildDocUrls(index.docs, base, localeConfig.default),
      ];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
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
