import { site } from '@/lib/config/site';
import type { ContentEntry } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/locales';
import { absoluteUrl } from '@/lib/seo/absolute-url';
import { ogImageUrl } from '@/lib/seo/og';

export type BreadcrumbItem = {
  name: string;
  path: string;
};

const context = 'https://schema.org';

function publisher() {
  return {
    '@type': 'Organization',
    logo: { '@type': 'ImageObject', url: absoluteUrl('icons/icon-512.png') },
    name: site.name,
    url: absoluteUrl('/'),
  };
}

export function articleJsonLd(entry: ContentEntry, sectionLabel: string): string {
  const url = absoluteUrl(entry.route);

  return JSON.stringify({
    '@context': context,
    '@type': 'TechArticle',
    articleSection: sectionLabel,
    author: publisher(),
    dateModified: entry.updatedAt,
    datePublished: entry.publishedAt,
    description: entry.description,
    headline: entry.title,
    image: ogImageUrl(entry.locale, entry.slug),
    inLanguage: entry.locale,
    isAccessibleForFree: true,
    keywords: entry.tags.join(', '),
    mainEntityOfPage: { '@id': url, '@type': 'WebPage' },
    publisher: publisher(),
    timeRequired: `PT${entry.readingMinutes}M`,
    url,
  });
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]): string {
  return JSON.stringify({
    '@context': context,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      item: absoluteUrl(item.path),
      name: item.name,
      position: index + 1,
    })),
  });
}

export function collectionJsonLd(
  locale: Locale,
  name: string,
  description: string,
  entries: ContentEntry[],
): string {
  return JSON.stringify({
    '@context': context,
    '@type': 'CollectionPage',
    description,
    inLanguage: locale,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: entries.map((entry, index) => ({
        '@type': 'ListItem',
        name: entry.title,
        position: index + 1,
        url: absoluteUrl(entry.route),
      })),
    },
    name,
    url: absoluteUrl(`/${locale}/docs`),
  });
}

export function websiteJsonLd(locale: Locale, description: string): string {
  return JSON.stringify({
    '@context': context,
    '@type': 'WebSite',
    description,
    inLanguage: locale,
    name: site.name,
    publisher: publisher(),
    url: absoluteUrl(`/${locale}`),
  });
}
