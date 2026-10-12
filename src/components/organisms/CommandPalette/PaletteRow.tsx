import { cva } from 'class-variance-authority';
import { useEffect, useRef } from 'react';

import { SectionGlyph } from '@/components/atoms';
import type { PaletteGroupId, PaletteItem } from '@/lib/search/palette-types';
import { cn } from '@/lib/utils/cn';

const rowVariants = cva(
  'flex w-full items-center gap-3 border-l-2 px-3 py-2.5 text-left transition-colors duration-150',
  {
    defaultVariants: { active: false },
    variants: {
      active: {
        false: 'border-transparent',
        true: 'border-accent-500 bg-neutral-200/70 dark:border-accent-400 dark:bg-neutral-800/80',
      },
    },
  },
);

const groupGlyphs: Record<PaletteGroupId, string> = {
  docs: 'code',
  navigation: 'nodes',
  settings: 'gear',
  tags: 'cube',
  topics: 'compass',
};

export function paletteOptionId(listId: string, itemId: string): string {
  return `${listId}-${itemId}`;
}

type PaletteRowProps = Readonly<{
  active: boolean;
  groupId: PaletteGroupId;
  item: PaletteItem;
  listId: string;
  onHighlight: (itemId: string) => void;
  onRun: (item: PaletteItem) => void;
}>;

export function PaletteRow({ active, groupId, item, listId, onHighlight, onRun }: PaletteRowProps) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (active) {
      ref.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [active]);

  return (
    <button
      aria-selected={active}
      className={cn(rowVariants({ active }))}
      id={paletteOptionId(listId, item.id)}
      onClick={() => {
        onRun(item);
      }}
      onPointerMove={() => {
        if (!active) {
          onHighlight(item.id);
        }
      }}
      ref={ref}
      role="option"
      tabIndex={-1}
      type="button"
    >
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center border transition-colors duration-150',
          active
            ? 'border-accent-500 text-accent-700 dark:border-accent-400 dark:text-accent-300'
            : 'border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400',
        )}
      >
        <SectionGlyph className="h-4 w-4" icon={groupGlyphs[groupId]} id={groupId} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-sans text-sm font-medium text-neutral-900 dark:text-neutral-50">
          {item.label}
        </span>
        {item.detail === undefined ? null : (
          <span className="block truncate font-serif text-sm text-neutral-600 dark:text-neutral-400">
            {item.detail}
          </span>
        )}
      </span>
      {item.meta === undefined ? null : (
        <span className="hidden shrink-0 font-mono text-[0.7rem] text-neutral-500 sm:inline dark:text-neutral-400">
          {item.meta}
        </span>
      )}
    </button>
  );
}
