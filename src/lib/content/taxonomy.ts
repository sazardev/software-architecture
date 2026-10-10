import taxonomyJson from '@/lib/content/taxonomy.json';
import type { Section } from '@/lib/content/types';

export const sections: Section[] = taxonomyJson.sections;

export function getSectionById(id: string): Section | undefined {
  return sections.find((section) => section.id === id);
}

export function isSectionId(id: string): boolean {
  return sections.some((section) => section.id === id);
}
