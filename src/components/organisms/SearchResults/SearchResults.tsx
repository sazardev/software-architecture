import { Link } from '@tanstack/react-router';

import { Badge, BlueprintFrame } from '@/components/atoms';
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
      <div className="border border-dashed border-neutral-300 p-10 text-center font-sans text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        {messages.search.noResults(query)}
      </div>
    );
  }

  return (
    <ul className="grid gap-5">
      {results.map(({ entry, heading }) => (
        <li key={entry.slug}>
          <BlueprintFrame className="group transition-colors duration-300 hover:border-neutral-900 dark:hover:border-neutral-300">
            <Link
              className="block p-6"
              params={{ locale: entry.locale, slug: entry.slug }}
              to="/$locale/docs/$slug"
              {...(heading === undefined ? {} : { hash: heading.id })}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50">
                  {entry.title}
                </p>
                <Badge tone="outline">{getSectionLabel(entry.category, locale)}</Badge>
              </div>
              <p className="mt-1.5 font-serif text-base text-neutral-600 dark:text-neutral-400">
                {entry.description}
              </p>
              {heading === undefined ? null : (
                <p className="mt-3 font-sans text-xs font-medium text-brand-700 dark:text-brand-300">
                  → {heading.text}
                </p>
              )}
            </Link>
          </BlueprintFrame>
        </li>
      ))}
    </ul>
  );
}
