import type { ContentHeading } from '@/lib/content/types';
import { useMessages } from '@/lib/i18n/use-messages';
import { cn } from '@/lib/utils/cn';

type TableOfContentsProps = Readonly<{
  collapsible?: boolean;
  headings: ContentHeading[];
}>;

export function TableOfContents({ collapsible = false, headings }: TableOfContentsProps) {
  const messages = useMessages();
  const visible = headings.filter((heading) => heading.level >= 2 && heading.level <= 3);

  if (visible.length === 0) {
    return null;
  }

  const list = (
    <ul className="space-y-2 text-sm">
      {visible.map((heading) => (
        <li className={cn(heading.level >= 3 && 'pl-4')} key={heading.id}>
          <a
            className="text-neutral-600 transition-colors hover:text-brand-600 dark:text-neutral-400 dark:hover:text-brand-400"
            href={`#${heading.id}`}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (collapsible) {
    return (
      <details className="rounded-lg border border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <summary className="cursor-pointer text-sm font-medium text-neutral-700 dark:text-neutral-200">
          {messages.a11y.tableOfContents}
        </summary>
        <div className="mt-3">{list}</div>
      </details>
    );
  }

  return (
    <nav aria-label={messages.a11y.tableOfContents}>
      <p className="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
        {messages.a11y.tableOfContents}
      </p>
      {list}
    </nav>
  );
}
