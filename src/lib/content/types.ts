import type { Locale } from '@/lib/i18n/locales';

export type ContentHeading = {
  id: string;
  level: number;
  text: string;
};

export type ContentEntry = {
  category: string;
  description: string;
  headings: ContentHeading[];
  locale: Locale;
  order: number;
  readingMinutes: number;
  route: string;
  slug: string;
  tags: string[];
  title: string;
  updatedAt: string;
};

export type LocalizedText = {
  description: string;
  label: string;
};

export type Section = {
  /**
  Glifo de plano (ver atom SectionGlyph). Opcional: si falta, se deriva del id.
  */
  icon?: string;
  id: string;
  labels: Record<Locale, LocalizedText>;
  order: number;
};
