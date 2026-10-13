import type { ContentHeading } from '@/lib/content/types';
import { useMessages } from '@/lib/i18n/use-messages';
import { cn } from '@/lib/utils/cn';

import { useActiveHeading } from './use-active-heading';

type TableOfContentsProps = Readonly<{
  headings: ContentHeading[];
  /**
  `rail`: marcas mínimas en el margen que se despliegan al pasar el cursor (estilo Notion).
  `collapsible`: bloque plegable para móvil.
  */
  variant: 'collapsible' | 'rail';
}>;

type HeadingListProps = Readonly<{
  activeId: string | undefined;
  headings: ContentHeading[];
}>;

function HeadingList({ activeId, headings }: HeadingListProps) {
  return (
    <ul className="space-y-0.5 border-l border-neutral-300 font-sans text-[0.8125rem] dark:border-neutral-700">
      {headings.map((heading) => {
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
                  : 'border-transparent text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50',
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
}

export function TableOfContents({ headings, variant }: TableOfContentsProps) {
  const messages = useMessages();
  const visible = headings.filter((heading) => heading.level >= 2 && heading.level <= 3);
  const activeId = useActiveHeading(
    visible.map((heading) => heading.id),
    variant === 'rail',
  );

  if (visible.length === 0) {
    return null;
  }

  if (variant === 'collapsible') {
    return (
      <details className="group border border-neutral-300 bg-neutral-50 px-5 py-3.5 dark:border-neutral-700 dark:bg-neutral-950">
        <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-xs tracking-[0.14em] text-neutral-700 uppercase marker:hidden dark:text-neutral-200 [&::-webkit-details-marker]:hidden">
          {messages.a11y.tableOfContents}
          <span
            aria-hidden="true"
            className="text-neutral-400 transition-transform duration-300 group-open:rotate-180"
          >
            ↓
          </span>
        </summary>
        <div className="mt-4 mb-1">
          <HeadingList activeId={undefined} headings={visible} />
        </div>
      </details>
    );
  }

  return (
    <nav
      aria-label={messages.a11y.tableOfContents}
      className="group/toc relative -mr-3 ml-auto w-fit px-3 py-2"
    >
      {/* Marcas mínimas: una por encabezado; la activa se alarga y se tiñe de brasa. */}
      <ul
        aria-hidden="true"
        className="flex max-h-[min(60vh,28rem)] flex-col items-end gap-[7px] py-1 transition-opacity duration-300 group-focus-within/toc:opacity-0 group-hover/toc:opacity-0"
      >
        {visible.map((heading) => (
          <li
            className={cn(
              'h-0.5 transition-[width,background-color] duration-300',
              heading.level >= 3 ? 'w-3' : 'w-5',
              heading.id === activeId ? 'w-7 bg-accent-500' : 'bg-neutral-300 dark:bg-neutral-700',
            )}
            key={heading.id}
          />
        ))}
      </ul>
      {/* Panel flotante: aparece al pasar el cursor o al enfocar un enlace. */}
      <div className="pointer-events-none absolute top-0 right-0 z-30 w-72 translate-x-2 border border-neutral-300 bg-neutral-50 p-4 opacity-0 transition-[opacity,transform] duration-200 group-focus-within/toc:pointer-events-auto group-focus-within/toc:translate-x-0 group-focus-within/toc:opacity-100 group-hover/toc:pointer-events-auto group-hover/toc:translate-x-0 group-hover/toc:opacity-100 dark:border-neutral-700 dark:bg-neutral-950">
        <p className="mb-3 font-mono text-[0.68rem] tracking-[0.18em] text-neutral-500 uppercase dark:text-neutral-400">
          {messages.a11y.tableOfContents}
        </p>
        <div className="max-h-[min(65vh,30rem)] [scrollbar-width:thin] overflow-y-auto pr-2">
          <HeadingList activeId={activeId} headings={visible} />
        </div>
      </div>
    </nav>
  );
}
