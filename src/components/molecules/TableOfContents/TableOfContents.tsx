import { useEffect, useState } from 'react';

import type { ContentHeading } from '@/lib/content/types';
import { useMessages } from '@/lib/i18n/use-messages';
import { cn } from '@/lib/utils/cn';

type TableOfContentsProps = Readonly<{
  collapsible?: boolean;
  headings: ContentHeading[];
}>;

/**
Observa los encabezados visibles y devuelve el id del que se está leyendo.
*/
function useActiveHeading(ids: string[], isEnabled: boolean): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isEnabled || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }

        const first = ids.find((id) => visible.has(id));

        if (first !== undefined) {
          setActiveId(first);
        }
      },
      { rootMargin: '-96px 0px -65% 0px' },
    );

    for (const id of ids) {
      const element = document.querySelector(`#${CSS.escape(id)}`);

      if (element !== null) {
        observer.observe(element);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [isEnabled, ids]);

  return activeId;
}

export function TableOfContents({ collapsible = false, headings }: TableOfContentsProps) {
  const messages = useMessages();
  const visible = headings.filter((heading) => heading.level >= 2 && heading.level <= 3);
  const activeId = useActiveHeading(
    visible.map((heading) => heading.id),
    !collapsible,
  );

  if (visible.length === 0) {
    return null;
  }

  const list = (
    <ul className="space-y-0.5 border-l border-neutral-200 font-sans text-[0.8125rem] dark:border-neutral-800">
      {visible.map((heading) => {
        const isActive = heading.id === activeId;

        return (
          <li key={heading.id}>
            <a
              aria-current={isActive ? 'location' : undefined}
              className={cn(
                '-ml-px block border-l-2 py-1.5 leading-snug transition-colors duration-300',
                heading.level >= 3 ? 'pl-7' : 'pl-4',
                isActive
                  ? 'border-accent-500 font-medium text-neutral-950 dark:text-neutral-50'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
              )}
              href={`#${heading.id}`}
            >
              {heading.text}
            </a>
          </li>
        );
      })}
    </ul>
  );

  if (collapsible) {
    return (
      <details className="group rounded-2xl border border-neutral-200 bg-white px-5 py-3.5 dark:border-neutral-800 dark:bg-neutral-900/60">
        <summary className="flex cursor-pointer list-none items-center justify-between font-sans text-sm font-semibold text-neutral-800 marker:hidden dark:text-neutral-100 [&::-webkit-details-marker]:hidden">
          {messages.a11y.tableOfContents}
          <span
            aria-hidden="true"
            className="text-neutral-400 transition-transform duration-300 group-open:rotate-180"
          >
            ↓
          </span>
        </summary>
        <div className="mt-4 mb-1">{list}</div>
      </details>
    );
  }

  return (
    <nav aria-label={messages.a11y.tableOfContents}>
      <p className="mb-4 font-sans text-xs font-semibold tracking-[0.18em] text-neutral-500 uppercase">
        {messages.a11y.tableOfContents}
      </p>
      {list}
    </nav>
  );
}
