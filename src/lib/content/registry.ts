import contentIndexJson from '@/content/index.gen.json';
import { sections } from '@/lib/content/taxonomy';
import type { ContentEntry, Section } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/locales';

export type SectionWithDocs = {
  docs: ContentEntry[];
  section: Section;
};

export type DocNeighbors = {
  next?: ContentEntry | undefined;
  previous?: ContentEntry | undefined;
};

const contentIndex = contentIndexJson;

export const docs: ContentEntry[] = contentIndex.docs as ContentEntry[];

export function getDocsByLocale(locale: Locale): ContentEntry[] {
  return docs.filter((doc) => doc.locale === locale);
}

export function getDocBySlug(locale: Locale, slug: string): ContentEntry | undefined {
  return getDocsByLocale(locale).find((doc) => doc.slug === slug);
}

export function getDocsBySection(locale: Locale, category?: string): SectionWithDocs[] {
  const localized = getDocsByLocale(locale);

  return sections
    .filter((section) => category === undefined || section.id === category)
    .map((section) => ({
      docs: localized.filter((doc) => doc.category === section.id),
      section,
    }))
    .filter((group) => group.docs.length > 0);
}

export function getDocNeighbors(locale: Locale, slug: string): DocNeighbors {
  const localized = getDocsByLocale(locale);
  const index = localized.findIndex((doc) => doc.slug === slug);
  const neighbors: DocNeighbors = {};

  if (index === -1) {
    return neighbors;
  }

  const next = localized[index + 1];

  if (next !== undefined) {
    neighbors.next = next;
  }

  const previous = localized[index - 1];

  if (previous !== undefined) {
    neighbors.previous = previous;
  }

  return neighbors;
}
