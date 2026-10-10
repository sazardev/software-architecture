import { Link } from '@tanstack/react-router';

import type { ContentEntry } from '@/lib/content/types';

type DocPagerProps = Readonly<{
  next: ContentEntry | undefined;
  previous: ContentEntry | undefined;
}>;

export function DocPager({ next, previous }: DocPagerProps) {
  if (next === undefined && previous === undefined) {
    return null;
  }

  return (
    <nav
      aria-label="Navegación entre documentos"
      className="mt-12 grid gap-4 border-t border-neutral-200 pt-6 sm:grid-cols-2 dark:border-neutral-800"
    >
      {previous === undefined ? (
        <span />
      ) : (
        <Link
          className="group rounded-lg border border-neutral-200 p-4 transition-colors hover:border-brand-400 dark:border-neutral-800 dark:hover:border-brand-600"
          params={{ slug: previous.slug }}
          to="/docs/$slug"
        >
          <span className="text-xs text-neutral-500">← Anterior</span>
          <span className="mt-1 block font-medium group-hover:text-brand-600 dark:group-hover:text-brand-400">
            {previous.title}
          </span>
        </Link>
      )}
      {next === undefined ? null : (
        <Link
          className="group rounded-lg border border-neutral-200 p-4 text-right transition-colors hover:border-brand-400 sm:col-start-2 dark:border-neutral-800 dark:hover:border-brand-600"
          params={{ slug: next.slug }}
          to="/docs/$slug"
        >
          <span className="text-xs text-neutral-500">Siguiente →</span>
          <span className="mt-1 block font-medium group-hover:text-brand-600 dark:group-hover:text-brand-400">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
