import { useEffect, useRef } from 'react';

import { Input } from '@/components/atoms';

const typingElementTags = new Set(['INPUT', 'TEXTAREA']);

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || typingElementTags.has(target.tagName))
  );
}

type SearchFieldProps = Readonly<{
  autoFocus?: boolean;
  id?: string;
  onValueChange: (value: string) => void;
  value: string;
}>;

export function SearchField({
  autoFocus = false,
  id = 'search-field',
  onValueChange,
  value,
}: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== '/' || isTypingTarget(event.target)) {
        return;
      }

      event.preventDefault();
      inputRef.current?.focus();
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <search className="block">
      <label className="sr-only" htmlFor={id}>
        Buscar recursos
      </label>
      <div className="relative">
        <Input
          aria-keyshortcuts="/"
          autoFocus={autoFocus}
          id={id}
          onChange={(event) => {
            onValueChange(event.currentTarget.value);
          }}
          placeholder="Buscar en la documentación…"
          ref={inputRef}
          type="search"
          value={value}
        />
        <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-neutral-300 px-1.5 text-xs text-neutral-400 sm:block dark:border-neutral-700 dark:text-neutral-500">
          /
        </kbd>
      </div>
    </search>
  );
}
