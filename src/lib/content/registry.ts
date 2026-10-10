import contentIndexJson from '@/content/index.gen.json';
import { sections } from '@/lib/content/taxonomy';
import type { ContentEntry, Section } from '@/lib/content/types';

export type SectionWithDocs = {
  docs: ContentEntry[];
  section: Section;
};

export type DocNeighbors = {
  next?: ContentEntry | undefined;
  previous?: ContentEntry | undefined;
};

const contentIndex = contentIndexJson;

export const docs: ContentEntry[] = contentIndex.docs;

export function getDocBySlug(slug: string): ContentEntry | undefined {
  return docs.find((doc) => doc.slug === slug);
}

export function getDocsBySection(category?: string): SectionWithDocs[] {
  return sections
    .filter((section) => category === undefined || section.id === category)
    .map((section) => ({
      docs: docs.filter((doc) => doc.category === section.id),
      section,
    }))
    .filter((group) => group.docs.length > 0);
}

export function getDocNeighbors(slug: string): DocNeighbors {
  const index = docs.findIndex((doc) => doc.slug === slug);
  const neighbors: DocNeighbors = {};

  if (index === -1) {
    return neighbors;
  }

  const next = docs[index + 1];

  if (next !== undefined) {
    neighbors.next = next;
  }

  const previous = docs[index - 1];

  if (previous !== undefined) {
    neighbors.previous = previous;
  }

  return neighbors;
}
