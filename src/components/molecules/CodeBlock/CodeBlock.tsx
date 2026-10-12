import { useEffect, useRef, useState, type ComponentProps } from 'react';

import { useMessages } from '@/lib/i18n/use-messages';
import { cn } from '@/lib/utils/cn';

type CodeBlockProps = Readonly<ComponentProps<'pre'>>;

/**
Envuelve el <pre> de Shiki y añade un botón para copiar el código.
*/
export function CodeBlock({ className, ...props }: CodeBlockProps) {
  const messages = useMessages();
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = setTimeout(() => {
      setCopied(false);
    }, 1800);

    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  async function copy() {
    const text = preRef.current?.textContent ?? '';

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const label = copied ? messages.code.copied : messages.code.copy;

  return (
    <div className="group/code relative my-8">
      <pre className={className} ref={preRef} {...props} />
      <button
        aria-label={label}
        className={cn(
          'absolute top-3 right-3 inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-300 bg-neutral-50/90 px-2.5 font-sans text-xs font-medium text-neutral-600 opacity-0 backdrop-blur transition-[opacity,color,border-color] duration-200 group-focus-within/code:opacity-100 group-hover/code:opacity-100 hover:border-neutral-900 hover:text-neutral-900 focus-visible:opacity-100 max-sm:opacity-100 dark:border-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-300 dark:hover:border-neutral-300 dark:hover:text-neutral-50',
          copied &&
            'border-emerald-500 text-emerald-700 dark:border-emerald-500 dark:text-emerald-300',
        )}
        onClick={() => {
          void copy();
        }}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          {copied ? (
            <path d="m5 12 5 5 9-10" />
          ) : (
            <>
              <rect height="13" rx="2" width="13" x="9" y="9" />
              <path d="M5 15V6a2 2 0 0 1 2-2h9" />
            </>
          )}
        </svg>
        <span aria-live="polite">{label}</span>
      </button>
    </div>
  );
}
