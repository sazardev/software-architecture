import { site } from '@/lib/config/site';
import type { ContentEntry } from '@/lib/content/types';
import { absoluteUrl } from '@/lib/seo/absolute-url';

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function articleJsonLd(entry: ContentEntry): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    dateModified: entry.updatedAt,
    description: entry.description,
    headline: entry.title,
    keywords: entry.tags.join(', '),
    timeRequired: `PT${entry.readingMinutes}M`,
    url: absoluteUrl(entry.route),
  });
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      item: absoluteUrl(item.path),
      name: item.name,
      position: index + 1,
    })),
  });
}

export function websiteJsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    description: site.description,
    name: site.name,
    url: absoluteUrl('/'),
  });
}
