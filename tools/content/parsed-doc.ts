import type { ContentHeading } from './extract-headings';

export type ParsedDoc = {
  body: string;
  headings: ContentHeading[];
  relativeFile: string;
  slug: string;
};
