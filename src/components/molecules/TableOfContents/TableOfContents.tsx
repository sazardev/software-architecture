import type { ContentHeading } from '@/lib/content/types';
import { cn } from '@/lib/utils/cn';

type TableOfContentsProps = Readonly<{
  headings: ContentHeading[];
}>;

export function TableOfContents({ headings }: TableOfContentsProps) {
  const visible = headings.filter((heading) => heading.level >= 2 && heading.level <= 3);

  if (visible.length === 0) {
    return null;
  }

  return (
    <nav aria-label="En esta página">
      <p className="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
        En esta página
      </p>
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
    </nav>
  );
}
