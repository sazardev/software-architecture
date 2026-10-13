import { useId } from 'react';

import { useMessages } from '@/lib/i18n/use-messages';

import { PaletteList } from './PaletteList';
import { paletteOptionId } from './PaletteRow';
import { usePaletteController } from './use-palette-controller';

type PaletteBodyProps = Readonly<{
  initialQuery: string;
  onClose: () => void;
}>;

const hintClass = 'flex items-center gap-1.5';
const keyClass =
  'rounded-md border border-neutral-300 px-1.5 py-0.5 leading-none dark:border-neutral-700';

export function PaletteBody({ initialQuery, onClose }: PaletteBodyProps) {
  const messages = useMessages();
  const listId = useId();
  const controller = usePaletteController({ initialQuery, onClose });
  const { activeItem, groups, itemCount, query } = controller;
  const hasResults = itemCount > 0;

  return (
    <>
      <div className="flex items-center gap-3 border-b border-neutral-300 px-4 dark:border-neutral-700">
        <svg
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          aria-activedescendant={
            activeItem === undefined ? undefined : paletteOptionId(listId, activeItem.id)
          }
          aria-autocomplete="list"
          aria-controls={hasResults ? listId : undefined}
          aria-expanded={hasResults}
          aria-label={messages.palette.inputLabel}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="h-14 min-w-0 flex-1 bg-transparent font-sans text-base text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-50 dark:placeholder:text-neutral-500"
          enterKeyHint="go"
          onChange={(event) => {
            controller.setQuery(event.currentTarget.value);
          }}
          onKeyDown={controller.handleKeyDown}
          placeholder={messages.palette.placeholder}
          role="combobox"
          spellCheck={false}
          type="text"
          value={query}
        />
        <button
          aria-label={messages.palette.close}
          className="shrink-0 rounded-md border border-neutral-300 px-1.5 py-1 font-mono text-[0.68rem] leading-none text-neutral-500 transition-colors duration-300 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-300 dark:hover:text-neutral-50"
          onClick={onClose}
          type="button"
        >
          esc
        </button>
      </div>

      <PaletteList
        activeItem={activeItem}
        groups={groups}
        listId={listId}
        onHighlight={controller.highlight}
        onRun={controller.run}
        query={query}
      />

      <p aria-live="polite" className="sr-only" role="status">
        {hasResults ? messages.palette.resultCount(itemCount) : messages.palette.empty(query)}
      </p>

      <div
        aria-hidden="true"
        className="flex items-center gap-5 border-t border-neutral-300 px-4 py-2.5 font-mono text-[0.68rem] text-neutral-500 dark:border-neutral-700 dark:text-neutral-400 [@media(pointer:coarse)]:hidden"
      >
        <span className={hintClass}>
          <kbd className={keyClass}>↑↓</kbd>
          {messages.palette.hints.navigate}
        </span>
        <span className={hintClass}>
          <kbd className={keyClass}>↵</kbd>
          {messages.palette.hints.select}
        </span>
        <span className={hintClass}>
          <kbd className={keyClass}>esc</kbd>
          {messages.palette.hints.close}
        </span>
      </div>
    </>
  );
}
