import { createFileRoute } from '@tanstack/react-router';

import { CategoryFilter, SearchField } from '@/components/molecules';
import { SearchResults } from '@/components/organisms';
import { site } from '@/lib/config/site';
import { parseSearchRouteParams, searchParams } from '@/lib/search/search-params';
import { useDeferredSearch } from '@/lib/search/use-deferred-search';
import { buildPageHead } from '@/lib/seo/meta';

export const Route = createFileRoute('/search')({
  component: SearchPage,
  head: () =>
    buildPageHead({
      description:
        'Búsqueda instantánea sobre títulos, descripciones, etiquetas y encabezados de todos los recursos.',
      noindex: true,
      path: '/search',
      title: `Buscar · ${site.name}`,
    }),
  validateSearch: parseSearchRouteParams,
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const query = search.q ?? '';
  const { isStale, results } = useDeferredSearch(query, {
    category: search.category,
    tag: search.tag,
  });

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Buscar</h1>
      <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
        Búsqueda local sobre títulos, etiquetas, descripciones y encabezados. Atajo de teclado:{' '}
        <kbd className="rounded border border-neutral-300 px-1.5 text-xs dark:border-neutral-700">
          /
        </kbd>
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
            className="rounded-full border border-brand-300 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 transition-colors hover:border-brand-400 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300"
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
        className={`mt-6 text-sm text-neutral-500 transition-opacity dark:text-neutral-400 ${isStale ? 'opacity-50' : ''}`}
      >
        {query === ''
          ? `${results.length} recursos disponibles`
          : `${results.length} resultado(s) para «${query}»`}
      </p>

      <div className="mt-4">
        <SearchResults query={query} results={results} />
      </div>
    </section>
  );
}
