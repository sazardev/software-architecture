import { docs } from '@/lib/content/registry';
import type { ContentEntry, ContentHeading } from '@/lib/content/types';

export type SearchResult = {
  entry: ContentEntry;
  heading: ContentHeading | undefined;
  score: number;
};

export type SearchFilters = {
  category?: string | undefined;
  tag?: string | undefined;
};

const weights = {
  description: 3,
  heading: 5,
  slug: 4,
  tags: 6,
  title: 8,
} as const;

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replaceAll(/[\u{300}-\u{36F}]/gu, '')
    .toLowerCase();
}

function hasToken(haystack: string, token: string): boolean {
  return normalize(haystack).includes(token);
}

function scoreEntry(
  entry: ContentEntry,
  tokens: string[],
): { heading: ContentHeading | undefined; score: number } | undefined {
  let score = 0;
  let heading: ContentHeading | undefined;

  for (const token of tokens) {
    let tokenScore = 0;

    if (hasToken(entry.title, token)) {
      tokenScore += weights.title;
    }

    if (hasToken(entry.slug, token)) {
      tokenScore += weights.slug;
    }

    if (entry.tags.some((tag) => hasToken(tag, token))) {
      tokenScore += weights.tags;
    }

    if (hasToken(entry.description, token)) {
      tokenScore += weights.description;
    }

    const matchedHeading = entry.headings.find((candidate) => hasToken(candidate.text, token));

    if (matchedHeading !== undefined) {
      tokenScore += weights.heading;
      heading ??= matchedHeading;
    }

    if (tokenScore === 0) {
      return undefined;
    }

    score += tokenScore;
  }

  return { heading, score };
}

export function searchDocs(query: string, filters: SearchFilters = {}): SearchResult[] {
  const tokens = normalize(query)
    .split(/\s+/)
    .filter((token) => token.length > 0);

  const candidates = docs.filter(
    (entry) =>
      (filters.category === undefined || entry.category === filters.category) &&
      (filters.tag === undefined || entry.tags.includes(filters.tag)),
  );

  if (tokens.length === 0) {
    return candidates.map((entry) => ({ entry, heading: undefined, score: 0 }));
  }

  const results: SearchResult[] = [];

  for (const entry of candidates) {
    const scored = scoreEntry(entry, tokens);

    if (scored !== undefined) {
      results.push({ entry, heading: scored.heading, score: scored.score });
    }
  }

  return results.toSorted(
    (a, b) =>
      b.score - a.score ||
      a.entry.order - b.entry.order ||
      a.entry.title.localeCompare(b.entry.title, 'es'),
  );
}
