import { SectionGlyph } from '@/components/atoms';
import type { SectionWithDocs } from '@/lib/content/registry';
import { getSectionText } from '@/lib/content/taxonomy';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import { cn } from '@/lib/utils/cn';

type TopicNavProps = Readonly<{
  active: string | undefined;
  className?: string;
  groups: SectionWithDocs[];
  onSelect: (category: string | undefined) => void;
}>;

/**
Índice vertical de temas con conteo; crece solo con la taxonomía.
*/
export function TopicNav({ active, className, groups, onSelect }: TopicNavProps) {
  const locale = useLocale();
  const messages = useMessages();
  const total = groups.reduce((sum, group) => sum + group.docs.length, 0);
  const options = [
    { count: total, icon: undefined, id: undefined, label: messages.docs.allTopics },
    ...groups.map((group) => ({
      count: group.docs.length,
      icon: group.section.icon,
      id: group.section.id,
      label: getSectionText(group.section, locale).label,
    })),
  ];

  return (
    <nav aria-label={messages.a11y.categoryFilter} className={className}>
      <p className="mb-4 font-mono text-[0.7rem] tracking-[0.16em] text-neutral-500 uppercase">
        {messages.docs.topics}
      </p>
      <ul className="border-l border-neutral-300 dark:border-neutral-700">
        {options.map((option) => {
          const isActive = option.id === active;

          return (
            <li key={option.id ?? 'all'}>
              <button
                aria-pressed={isActive}
                className={cn(
                  '-ml-px flex w-full items-center gap-3 border-l-2 py-2 pr-2 pl-4 text-left font-sans text-sm transition-colors duration-300',
                  isActive
                    ? 'border-accent-500 font-medium text-neutral-950 dark:text-neutral-50'
                    : 'border-transparent text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50',
                )}
                onClick={() => {
                  onSelect(option.id);
                }}
                type="button"
              >
                {option.id === undefined ? null : (
                  <SectionGlyph className="h-4 w-4 shrink-0" icon={option.icon} id={option.id} />
                )}
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                <span className="font-mono text-xs text-neutral-400">{option.count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
