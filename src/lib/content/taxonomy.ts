import taxonomyJson from '@/lib/content/taxonomy.json';
import type { LocalizedText, Section } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/locales';

export const sections: Section[] = taxonomyJson.sections.toSorted((a, b) => a.order - b.order);

export function isSectionId(id: string): boolean {
  return sections.some((section) => section.id === id);
}

export function getSectionText(section: Section, locale: Locale): LocalizedText {
  return section.labels[locale];
}

export function getSectionLabel(id: string, locale: Locale): string {
  const section = sections.find((candidate) => candidate.id === id);

  return section === undefined ? id : getSectionText(section, locale).label;
}
