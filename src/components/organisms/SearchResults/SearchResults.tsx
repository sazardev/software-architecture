import { Link } from '@tanstack/react-router';

import { Badge } from '@/components/atoms';
import { getSectionLabel } from '@/lib/content/taxonomy';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import type { SearchResult } from '@/lib/search/search';

type SearchResultsProps = Readonly<{
  query: string;
  results: SearchResult[];
}>;

export function SearchResults({ query, results }: SearchResultsProps) {
  const locale = useLocale();
  const messages = useMessages();

  if (results.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        {messages.search.noResults(query)}
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {results.map(({ entry, heading }) => (
        <li key={entry.slug}>
          <Link
            className="block rounded-lg border border-neutral-200 p-4 transition-colors hover:border-brand-400 dark:border-neutral-800 dark:hover:border-brand-600"
            params={{ locale: entry.locale, slug: entry.slug }}
            to="/$locale/docs/$slug"
            {...(heading === undefined ? {} : { hash: heading.id })}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{entry.title}</p>
              <Badge tone="outline">{getSectionLabel(entry.category, locale)}</Badge>
            </div>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {entry.description}
            </p>
            {heading === undefined ? null : (
              <p className="mt-2 text-xs font-medium text-brand-600 dark:text-brand-400">
                → {heading.text}
              </p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
