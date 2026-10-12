import { createFileRoute } from '@tanstack/react-router';

import { Container } from '@/components/atoms';
import { CategoryFilter, SearchField } from '@/components/molecules';
import { SearchResults } from '@/components/organisms';
import { resolveLocaleParam } from '@/lib/i18n/locale-head';
import { useMessages } from '@/lib/i18n/use-messages';
import { parseSearchRouteParams, searchParams } from '@/lib/search/search-params';
import { useDeferredSearch } from '@/lib/search/use-deferred-search';
import { searchSeo, toRouteHead } from '@/lib/seo/page-heads';
import { cn } from '@/lib/utils/cn';

export const Route = createFileRoute('/$locale/search')({
  component: SearchPage,
  head: ({ params }) => toRouteHead(searchSeo(resolveLocaleParam(params.locale))),
  validateSearch: parseSearchRouteParams,
});

function SearchPage() {
  const { locale: localeParam } = Route.useParams();
  const locale = resolveLocaleParam(localeParam);
  const messages = useMessages();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const query = search.q ?? '';
  const { isStale, results } = useDeferredSearch(query, {
    category: search.category,
    locale,
    tag: search.tag,
  });

  return (
    <Container className="py-14 sm:py-20" size="narrow">
      <h1
        className="mb-3 animate-rise font-display text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.02] font-medium tracking-[-0.03em] text-neutral-950 dark:text-neutral-50"
        style={{ fontVariationSettings: "'opsz' 144" }}
      >
        {messages.search.title}
      </h1>
      <p className="mb-8 font-serif text-lg text-neutral-600 dark:text-neutral-400">
        {messages.search.hint}{' '}
        <span className="hidden sm:inline">
          {messages.search.shortcut}{' '}
          <kbd className="rounded-md border border-neutral-300 px-1.5 font-mono text-xs dark:border-neutral-700">
            /
          </kbd>
        </span>
      </p>

      <SearchField
        autoFocus
        onValueChange={(value) => {
          void navigate({
            replace: true,
            search: searchParams({ ...search, q: value === '' ? undefined : value }),
          });
        }}
        value={query}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <CategoryFilter
          active={search.category}
          onSelect={(category) => {
            void navigate({ replace: true, search: searchParams({ ...search, category }) });
          }}
        />
        {search.tag === undefined ? null : (
          <button
            aria-label={messages.search.removeTag(search.tag)}
            className="rounded-full border border-brand-300 bg-brand-50 px-4 py-1.5 font-sans text-sm font-medium text-brand-700 transition-colors hover:border-brand-500 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300"
            onClick={() => {
              void navigate({ replace: true, search: searchParams({ ...search, tag: undefined }) });
            }}
            type="button"
          >
            #{search.tag} ✕
          </button>
        )}
      </div>

      <p
        className={cn(
          'mt-8 font-sans text-sm text-neutral-500 transition-opacity dark:text-neutral-400',
          isStale && 'opacity-50',
        )}
      >
        {query === ''
          ? messages.search.available(results.length)
          : messages.search.results(results.length, query)}
      </p>

      <div className="mt-4">
        <SearchResults query={query} results={results} />
      </div>
    </Container>
  );
}
