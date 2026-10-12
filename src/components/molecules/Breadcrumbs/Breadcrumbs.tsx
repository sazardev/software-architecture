import { Link } from '@tanstack/react-router';

import { useMessages } from '@/lib/i18n/use-messages';
import { cn } from '@/lib/utils/cn';

type BreadcrumbItem = Readonly<{
  label: string;
  params?: Record<string, string>;
  to?: string;
}>;

type BreadcrumbsProps = Readonly<{
  className?: string;
  items: BreadcrumbItem[];
}>;

export function Breadcrumbs({ className, items }: BreadcrumbsProps) {
  const messages = useMessages();

  return (
    <nav
      aria-label={messages.a11y.breadcrumbs}
      className={cn('font-sans text-[0.8rem] text-neutral-500 dark:text-neutral-400', className)}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li className="flex items-center gap-2" key={item.label}>
              {index > 0 ? (
                <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">
                  /
                </span>
              ) : null}
              {!isLast && item.to !== undefined ? (
                <Link
                  className="transition-colors hover:text-brand-600 dark:hover:text-brand-400"
                  params={item.params as never}
                  to={item.to as never}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={isLast ? 'text-neutral-700 dark:text-neutral-200' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
