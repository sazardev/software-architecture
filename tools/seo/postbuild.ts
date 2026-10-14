import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { site } from '@/lib/config/site';
import { getDocsByLocale } from '@/lib/content/registry';
import { defaultLocale, locales, type Locale } from '@/lib/i18n/locales';
import { getRoadmapPaths } from '@/lib/roadmap/roadmap-registry';
import { absoluteUrl } from '@/lib/seo/absolute-url';
import { feedPath, llmsFullPath, llmsPath, ogImagePath } from '@/lib/seo/og';
import {
  docSeo,
  docsIndexSeo,
  homeSeo,
  roadmapIndexSeo,
  roadmapSeo,
  type PageSeo,
} from '@/lib/seo/page-heads';

import { parseArticleBlocks, readDocBody } from './article-blocks';
import { blocksToHtml } from './article-serializers';
import { buildFeed } from './feed';
import { buildLlmsFullTxt, buildLlmsRoot, buildLlmsTxt } from './llms';
import { renderOgCard, type OgCardInput } from './og-card';
import { docCard, homeCard } from './og-inputs';
import { renderPage } from './prerender';

const dist = join(import.meta.dir, '..', '..', 'dist');

async function write(relativePath: string, content: string | Uint8Array): Promise<void> {
  const target = join(dist, relativePath);

  await mkdir(dirname(target), { recursive: true });
  await Bun.write(target, content);
}

async function writeOgImage(card: OgCardInput | Promise<OgCardInput>, path: string): Promise<void> {
  await write(path, await renderOgCard(await card));
}

async function writeOgImages(): Promise<number> {
  const jobs = locales.flatMap((locale) => [
    writeOgImage(homeCard(locale), ogImagePath(locale)),
    ...getDocsByLocale(locale).map((entry) =>
      writeOgImage(docCard(entry), ogImagePath(locale, entry.slug)),
    ),
  ]);

  await Promise.all(jobs);

  return jobs.length;
}

type PageJob = { contentHtml?: string; locale: Locale; path: string; seo: PageSeo };

async function articleHtml(locale: string, slug: string): Promise<string> {
  const blocks = parseArticleBlocks(await readDocBody(locale, slug));

  return blocksToHtml(blocks, locale);
}

async function listPages(): Promise<PageJob[]> {
  const pages: PageJob[] = [];

  for (const locale of locales) {
    pages.push(
      { locale, path: `${locale}/index.html`, seo: homeSeo(locale) },
      { locale, path: `${locale}/docs/index.html`, seo: docsIndexSeo(locale) },
      { locale, path: `${locale}/roadmap/index.html`, seo: roadmapIndexSeo(locale) },
      ...getRoadmapPaths(locale).map((roadmap) => ({
        locale,
        path: `${locale}/roadmap/${roadmap.roadmap.id}/index.html`,
        seo: roadmapSeo(locale, roadmap),
      })),
    );

    for (const entry of getDocsByLocale(locale)) {
      pages.push({
        locale,
        path: `${locale}/docs/${entry.slug}/index.html`,
        seo: docSeo(entry),
        contentHtml: await articleHtml(entry.locale, entry.slug),
      });
    }
  }

  // La raíz redirige por JS al idioma preferido; los crawlers ven la portada del idioma por defecto.
  return [{ locale: defaultLocale, path: 'index.html', seo: homeSeo(defaultLocale) }, ...pages];
}

function pathToRoute(path: string): string {
  const route = path.replace(/\/?index\.html$/, '');

  return route === '' ? '/' : `/${route}`;
}

async function writePages(): Promise<number> {
  const template = await Bun.file(join(dist, 'index.html')).text();
  const pages = await listPages();

  await Promise.all(
    pages.map((page) => {
      const url = absoluteUrl(pathToRoute(page.path));

      return write(page.path, renderPage(template, page.locale, page.seo, url, page.contentHtml));
    }),
  );

  return pages.length;
}

async function writeFeeds(): Promise<number> {
  await Promise.all(locales.map((locale) => write(feedPath(locale), buildFeed(locale))));

  return locales.length;
}

function humansTxt(): string {
  return `/* TEAM */\nSite: ${site.name}\nRepo: ${site.repo}\nContact: ${site.repo}/issues\n`;
}

function securityTxt(): string {
  return `Contact: ${site.repo}/security/advisories/new\nExpires: 2027-12-31T00:00:00.000Z\nPreferred-Languages: es, en\n`;
}

async function writeLlms(): Promise<number> {
  const jobs = [
    write('llms.txt', buildLlmsRoot()),
    ...locales.map(async (locale) => {
      await write(llmsPath(locale), buildLlmsTxt(locale));
      await write(llmsFullPath(locale), await buildLlmsFullTxt(locale));
    }),
    write('humans.txt', humansTxt()),
    write('.well-known/security.txt', securityTxt()),
  ];

  await Promise.all(jobs);

  return jobs.length + locales.length;
}

const [pages, images, feeds, llms] = await Promise.all([
  writePages(),
  writeOgImages(),
  writeFeeds(),
  writeLlms(),
]);

console.log(
  `✔ SEO postbuild: ${pages} páginas estáticas, ${images} tarjetas OG, ${feeds} feeds, ${llms} archivos LLM/humans/security`,
);
