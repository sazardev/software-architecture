import { sections } from '@/lib/content/taxonomy';
import { cn } from '@/lib/utils/cn';

type CategoryFilterProps = Readonly<{
  active: string | undefined;
  className?: string;
  onSelect: (category: string | undefined) => void;
}>;

export function CategoryFilter({ active, className, onSelect }: CategoryFilterProps) {
  const options = [
    { id: undefined, label: 'Todas' },
    ...sections.map((s) => ({ id: s.id, label: s.label })),
  ];

  return (
    <div
      aria-label="Filtrar por sección"
      className={cn('flex flex-wrap gap-2', className)}
      role="group"
    >
      {options.map((option) => {
        const isActive = option.id === active;

        return (
          <button
            aria-pressed={isActive}
            className={cn(
              'rounded-full border px-3 py-1 text-sm font-medium transition-colors',
              isActive
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-neutral-300 text-neutral-600 hover:border-brand-400 hover:text-brand-600 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-brand-600 dark:hover:text-brand-400',
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
