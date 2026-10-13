import { site } from '@/lib/config/site';
import {
  defaultLocale,
  getLocaleDefinition,
  locales,
  switchLocalePath,
  type Locale,
} from '@/lib/i18n/locales';
import { absoluteUrl } from '@/lib/seo/absolute-url';
import { feedUrl, llmsUrl, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/lib/seo/og';

type HeadLinkEntry = {
  href: string;
  hrefLang?: string;
  rel: string;
  title?: string;
  type?: string;
};

type HeadMetaEntry = {
  content?: string;
  name?: string;
  property?: string;
  title?: string;
};

export type PageHead = {
  links: HeadLinkEntry[];
  meta: HeadMetaEntry[];
};

type ArticleMeta = {
  modifiedAt: string;
  publishedAt: string;
  section: string;
  tags: string[];
};

type PageHeadInput = {
  // Idiomas en los que existe esta página (hreflang). Por defecto, todos.
  alternateLocales?: readonly Locale[];
  article?: ArticleMeta;
  description: string;
  image?: { alt: string; url: string };
  locale: Locale;
  noindex?: boolean;
  path: string;
  title: string;
  type?: 'article' | 'website';
};

const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

function buildAlternateLinks(input: PageHeadInput): HeadLinkEntry[] {
  const available = input.alternateLocales ?? locales;
  const links: HeadLinkEntry[] = available.map((code) => ({
    href: absoluteUrl(switchLocalePath(input.path, code)),
    hrefLang: code,
    rel: 'alternate',
  }));
  const fallback = available.includes(defaultLocale) ? defaultLocale : available[0];

  if (fallback !== undefined) {
    links.push({
      href: absoluteUrl(switchLocalePath(input.path, fallback)),
      hrefLang: 'x-default',
      rel: 'alternate',
    });
  }

  return links;
}

function buildImageMeta(image: NonNullable<PageHeadInput['image']>): HeadMetaEntry[] {
  return [
    { content: image.url, property: 'og:image' },
    { content: 'image/png', property: 'og:image:type' },
    { content: String(OG_IMAGE_WIDTH), property: 'og:image:width' },
    { content: String(OG_IMAGE_HEIGHT), property: 'og:image:height' },
    { content: image.alt, property: 'og:image:alt' },
    { content: image.url, name: 'twitter:image' },
    { content: image.alt, name: 'twitter:image:alt' },
  ];
}

function buildArticleMeta(article: ArticleMeta): HeadMetaEntry[] {
  return [
    { content: article.publishedAt, property: 'article:published_time' },
    { content: article.modifiedAt, property: 'article:modified_time' },
    { content: article.section, property: 'article:section' },
    ...article.tags.map((tag) => ({ content: tag, property: 'article:tag' })),
  ];
}

export function buildPageHead(input: PageHeadInput): PageHead {
  const type = input.type ?? 'website';
  const url = absoluteUrl(input.path);
  const definition = getLocaleDefinition(input.locale);

  const meta: HeadMetaEntry[] = [
    { title: input.title },
    { content: input.description, name: 'description' },
    { content: site.name, name: 'author' },
    ...(input.article === undefined
      ? []
      : [{ content: input.article.tags.join(', '), name: 'keywords' }]),
    { content: input.noindex === true ? 'noindex, nofollow' : ROBOTS_INDEX, name: 'robots' },
    { content: type, property: 'og:type' },
    { content: input.title, property: 'og:title' },
    { content: input.description, property: 'og:description' },
    { content: url, property: 'og:url' },
    { content: site.name, property: 'og:site_name' },
    { content: definition.ogLocale, property: 'og:locale' },
    ...locales
      .filter((code) => code !== input.locale)
      .map((code) => ({
        content: getLocaleDefinition(code).ogLocale,
        property: 'og:locale:alternate',
      })),
    {
      content: input.image === undefined ? 'summary' : 'summary_large_image',
      name: 'twitter:card',
    },
    { content: input.title, name: 'twitter:title' },
    { content: input.description, name: 'twitter:description' },
    ...(input.image === undefined ? [] : buildImageMeta(input.image)),
    ...(input.article === undefined ? [] : buildArticleMeta(input.article)),
  ];

  return {
    links: [
      { href: url, rel: 'canonical' },
      ...buildAlternateLinks(input),
      {
        href: feedUrl(input.locale),
        rel: 'alternate',
        title: `${site.name} (${input.locale})`,
        type: 'application/rss+xml',
      },
      {
        href: llmsUrl(input.locale),
        rel: 'alternate',
        title: `${site.name} LLMs.txt (${input.locale})`,
        type: 'text/plain',
      },
    ],
    meta,
  };
}
