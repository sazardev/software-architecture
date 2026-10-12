import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { site } from '@/lib/config/site';
import { getDocsByLocale } from '@/lib/content/registry';
import { getSectionLabel } from '@/lib/content/taxonomy';
import type { ContentEntry } from '@/lib/content/types';
import { defaultLocale, locales, type Locale } from '@/lib/i18n/locales';
import { getMessages } from '@/lib/i18n/messages';
import { absoluteUrl } from '@/lib/seo/absolute-url';
import { feedPath, ogImagePath } from '@/lib/seo/og';
import { docSeo, docsIndexSeo, homeSeo, searchSeo, type PageSeo } from '@/lib/seo/page-heads';
import { formatDate } from '@/lib/utils/format-date';

import { buildFeed } from './feed';
import { renderOgCard, type OgCardInput } from './og-card';
import { renderPage } from './prerender';

const dist = join(import.meta.dir, '..', '..', 'dist');

const pad = (value: number): string => String(value).padStart(2, '0');

async function write(relativePath: string, content: string | Uint8Array): Promise<void> {
  const target = join(dist, relativePath);

  await mkdir(dirname(target), { recursive: true });
  await Bun.write(target, content);
}

function siteHost(): string {
  return site.url.replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

function homeCard(locale: Locale): OgCardInput {
  const messages = getMessages(locale);
  const docs = getDocsByLocale(locale);
  const latest = docs.map((doc) => doc.updatedAt).toSorted((a, b) => b.localeCompare(a))[0];

  return {
    accent: messages.home.titleAccent,
    description: messages.site.description,
    eyebrow: messages.home.eyebrow,
    rows: [
      [messages.blueprint.sheet, `01/${pad(docs.length)}`],
      [messages.blueprint.rev, latest === undefined ? '—' : formatDate(latest, locale)],
    ],
    siteName: site.name,
    siteUrl: siteHost(),
    title: messages.home.titleLead,
  };
}

function docCard(entry: ContentEntry): OgCardInput {
  const { locale } = entry;
  const messages = getMessages(locale);
  const docs = getDocsByLocale(locale);
  const sheet = docs.findIndex((doc) => doc.slug === entry.slug) + 1;

  return {
    description: entry.description,
    eyebrow: getSectionLabel(entry.category, locale),
    rows: [
      [messages.blueprint.sheet, `${pad(sheet)}/${pad(docs.length)}`],
      [messages.blueprint.reading, messages.docs.minutesShort(entry.readingMinutes)],
      [messages.blueprint.rev, formatDate(entry.updatedAt, locale)],
    ],
    siteName: site.name,
    siteUrl: siteHost(),
    title: entry.title,
  };
}

async function writeOgImage(card: OgCardInput, path: string): Promise<void> {
  await write(path, await renderOgCard(card));
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

type PageJob = { locale: Locale; path: string; seo: PageSeo };

function listPages(): PageJob[] {
  const pages = locales.flatMap((locale) => [
    { locale, path: `${locale}/index.html`, seo: homeSeo(locale) },
    { locale, path: `${locale}/docs/index.html`, seo: docsIndexSeo(locale) },
    { locale, path: `${locale}/search/index.html`, seo: searchSeo(locale) },
    ...getDocsByLocale(locale).map((entry) => ({
      locale,
      path: `${locale}/docs/${entry.slug}/index.html`,
      seo: docSeo(entry),
    })),
  ]);

  // La raíz redirige por JS al idioma preferido; los crawlers ven la portada del idioma por defecto.
  return [{ locale: defaultLocale, path: 'index.html', seo: homeSeo(defaultLocale) }, ...pages];
}

async function writePages(): Promise<number> {
  const template = await Bun.file(join(dist, 'index.html')).text();
  const pages = listPages();

  await Promise.all(
    pages.map((page) =>
      write(page.path, renderPage(template, page.locale, page.seo, absoluteUrl(`/${page.locale}`))),
    ),
  );

  return pages.length;
}

async function writeFeeds(): Promise<number> {
  await Promise.all(locales.map((locale) => write(feedPath(locale), buildFeed(locale))));

  return locales.length;
}

const [pages, images, feeds] = await Promise.all([writePages(), writeOgImages(), writeFeeds()]);

console.log(`✔ SEO postbuild: ${pages} páginas estáticas, ${images} tarjetas OG, ${feeds} feeds`);
