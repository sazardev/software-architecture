import { isSectionId } from '@/lib/content/taxonomy';

export type SearchRouteParams = {
  category?: string | undefined;
  q?: string | undefined;
  tag?: string | undefined;
};

const maxQueryLength = 100;

function readQuery(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0
    ? value.slice(0, maxQueryLength)
    : undefined;
}

function readTag(value: unknown): string | undefined {
  return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? value : undefined;
}

function readCategory(value: unknown): string | undefined {
  return typeof value === 'string' && isSectionId(value) ? value : undefined;
}

export function parseSearchRouteParams(search: Record<string, unknown>): SearchRouteParams {
  return {
    category: readCategory(search.category),
    q: readQuery(search.q),
    tag: readTag(search.tag),
  };
}

export function searchParams(input: Partial<SearchRouteParams> = {}): SearchRouteParams {
  return { category: undefined, q: undefined, tag: undefined, ...input };
}
