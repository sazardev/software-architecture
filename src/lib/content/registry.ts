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

export function getLatestDocs(locale: Locale, limit: number): ContentEntry[] {
  return getDocsByLocale(locale)
    .toSorted((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.order - b.order)
    .slice(0, limit);
}

export function getRelatedDocs(
  entry: ContentEntry,
  limit: number,
  excludeSlugs: readonly string[] = [],
): ContentEntry[] {
  const candidates = getDocsByLocale(entry.locale).filter(
    (doc) => doc.slug !== entry.slug && !excludeSlugs.includes(doc.slug),
  );
  const sameSection = candidates.filter((doc) => doc.category === entry.category);
  const otherSections = candidates.filter((doc) => doc.category !== entry.category);

  return [...sameSection, ...otherSections].slice(0, limit);
}

export type TagCount = {
  count: number;
  tag: string;
};

/**
Etiquetas más usadas del idioma (desempate alfabético), para el índice por etiqueta.
*/
export function getTopTags(locale: Locale, limit: number): TagCount[] {
  const counts = new Map<string, number>();

  for (const doc of getDocsByLocale(locale)) {
    for (const tag of doc.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts]
    .map(([tag, count]) => ({ count, tag }))
    .toSorted((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, limit);
}

export type DocSheet = {
  /**
  Posición (1-based) del documento en el orden del idioma.
  */
  index: number;
  total: number;
};

/**
Numeración "hoja X de N" para el cajetín de plano.
*/
export function getDocSheet(locale: Locale, slug: string): DocSheet {
  const localized = getDocsByLocale(locale);

  return { index: localized.findIndex((doc) => doc.slug === slug) + 1, total: localized.length };
}
