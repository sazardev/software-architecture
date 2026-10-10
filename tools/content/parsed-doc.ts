import type { ContentHeading } from './extract-headings';

export type ParsedDoc = {
  body: string;
  headings: ContentHeading[];
  locale: string;
  relativeFile: string;
  slug: string;
};
