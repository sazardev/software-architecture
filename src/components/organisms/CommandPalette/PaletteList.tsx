import { useMessages } from '@/lib/i18n/use-messages';
import type { PaletteGroup, PaletteItem } from '@/lib/search/palette-types';

import { PaletteRow } from './PaletteRow';

type PaletteListProps = Readonly<{
  activeItem: PaletteItem | undefined;
  groups: PaletteGroup[];
  listId: string;
  onHighlight: (itemId: string) => void;
  onRun: (item: PaletteItem) => void;
  query: string;
}>;

export function PaletteList({
  activeItem,
  groups,
  listId,
  onHighlight,
  onRun,
  query,
}: PaletteListProps) {
  const messages = useMessages();
  if (groups.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="font-display text-lg text-neutral-900 dark:text-neutral-50">
          {messages.palette.empty(query.trim())}
        </p>
        <p className="mt-1.5 font-serif text-sm text-neutral-600 dark:text-neutral-400">
          {messages.palette.emptyHint}
        </p>
      </div>
    );
  }

  return (
    <div
      aria-label={messages.palette.inputLabel}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2"
      id={listId}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      role="listbox"
    >
      {groups.map((group) => (
        <div aria-labelledby={`${listId}-group-${group.id}`} key={group.id} role="group">
          <p
            className="px-3 pt-3 pb-1.5 font-mono text-[0.68rem] font-medium tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400"
            id={`${listId}-group-${group.id}`}
          >
            {group.label}
          </p>
          {group.items.map((item) => (
            <PaletteRow
              active={item.id === activeItem?.id}
              groupId={group.id}
              item={item}
              key={item.id}
              listId={listId}
              onHighlight={onHighlight}
              onRun={onRun}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
