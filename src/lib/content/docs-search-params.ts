import { isSectionId } from '@/lib/content/taxonomy';

export type DocsSearchParams = {
  category?: string | undefined;
};

export function parseDocsSearchParams(search: Record<string, unknown>): DocsSearchParams {
  const { category } = search;

  return {
    category: typeof category === 'string' && isSectionId(category) ? category : undefined,
  };
}
