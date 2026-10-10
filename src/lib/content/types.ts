export type ContentHeading = {
  id: string;
  level: number;
  text: string;
};

export type ContentEntry = {
  category: string;
  description: string;
  headings: ContentHeading[];
  order: number;
  readingMinutes: number;
  route: string;
  slug: string;
  tags: string[];
  title: string;
  updatedAt: string;
};

export type Section = {
  description: string;
  id: string;
  label: string;
  order: number;
};
