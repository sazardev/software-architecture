import type { Locale } from '@/lib/i18n/locales';

export type ContentHeading = {
  id: string;
  level: number;
  text: string;
};

export type ContentEntry = {
  category: string;
  description: string;
  /**
  Pie de la figura del artículo («FIG. NN — …»); también es el texto alternativo de la tarjeta social.
  */
  figureCaption: string;
  headings: ContentHeading[];
  locale: Locale;
  order: number;
  /**
  Primera publicación (YYYY-MM-DD); define qué es «lo último» en la portada.
  */
  publishedAt: string;
  readingMinutes: number;
  /**
  Lugar del artículo en su roadmap (ver `roadmaps.json`): ruta, etapa y paso dentro de la etapa.
  */
  roadmap: RoadmapPlacement;
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

type RoadmapPlacement = {
  id: string;
  stage: string;
  /**
  Ordena dentro de la etapa; no tiene que ser consecutivo (la numeración visible se calcula).
  */
  step: number;
};

export type RoadmapStage = {
  id: string;
  labels: Record<Locale, LocalizedText>;
};

export type Roadmap = {
  /**
  Glifo de plano (ver atom SectionGlyph). Opcional: si falta, se deriva del id.
  */
  icon?: string;
  id: string;
  labels: Record<Locale, LocalizedText>;
  order: number;
  stages: RoadmapStage[];
};
