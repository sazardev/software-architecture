import { useDeferredValue, useMemo } from 'react';

import { searchDocs, type SearchFilters, type SearchResult } from '@/lib/search/search';

export type DeferredSearch = {
  isStale: boolean;
  results: SearchResult[];
};

export function useDeferredSearch(query: string, filters: SearchFilters): DeferredSearch {
  const deferredQuery = useDeferredValue(query);
  const { category, tag } = filters;

  const results = useMemo(
    () => searchDocs(deferredQuery, { category, tag }),
    [deferredQuery, category, tag],
  );

  return { isStale: deferredQuery !== query, results };
}
