import type { ContentHeading } from './extract-headings';
import type { RoadmapPlacement } from './schema';

export type ParsedDoc = {
  body: string;
  figureCaption: string;
  headings: ContentHeading[];
  locale: string;
  relativeFile: string;
  roadmap: RoadmapPlacement;
  slug: string;
};
