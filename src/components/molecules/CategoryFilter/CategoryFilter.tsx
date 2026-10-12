import { getSectionText, sections } from '@/lib/content/taxonomy';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import { cn } from '@/lib/utils/cn';

type CategoryFilterProps = Readonly<{
  active: string | undefined;
  className?: string;
  onSelect: (category: string | undefined) => void;
}>;

export function CategoryFilter({ active, className, onSelect }: CategoryFilterProps) {
  const locale = useLocale();
  const messages = useMessages();
  const options = [
    { id: undefined, label: messages.docs.allTopics },
    ...sections.map((section) => ({
      id: section.id,
      label: getSectionText(section, locale).label,
    })),
  ];

  return (
    <div
      aria-label={messages.a11y.categoryFilter}
      className={cn(
        '-mx-5 flex [scrollbar-width:none] gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden',
        className,
      )}
      role="group"
    >
      {options.map((option) => {
        const isActive = option.id === active;

        return (
          <button
            aria-pressed={isActive}
            className={cn(
              'shrink-0 rounded-full border px-4 py-1.5 font-sans text-sm font-medium transition-colors duration-300',
              isActive
                ? 'border-neutral-900 bg-neutral-900 text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-900'
                : 'border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-300 dark:hover:text-neutral-50',
            )}
            key={option.id ?? 'all'}
            onClick={() => {
              onSelect(option.id);
            }}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
