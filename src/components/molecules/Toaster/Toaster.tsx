import { useEffect, useState } from 'react';

import { TOAST_EVENT } from '@/lib/ui/toast';

const TOAST_DURATION_MS = 2200;

/**
Aviso efímero accesible (aria-live). Escucha los eventos de `showToast`.
*/
export function Toaster() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    function handleToast(event: Event) {
      if (!(event instanceof CustomEvent) || typeof event.detail !== 'string') {
        return;
      }

      setMessage(event.detail);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setMessage(null);
      }, TOAST_DURATION_MS);
    }

    addEventListener(TOAST_EVENT, handleToast);

    return () => {
      clearTimeout(timeout);
      removeEventListener(TOAST_EVENT, handleToast);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"
      role="status"
    >
      {message === null ? null : (
        <p className="flex animate-rise items-center gap-2.5 border border-neutral-900 bg-neutral-900 px-4 py-2.5 font-mono text-xs tracking-[0.08em] text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-900">
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 text-accent-400 dark:text-accent-600"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path d="m5 12 5 5 9-10" />
          </svg>
          {message}
        </p>
      )}
    </div>
  );
}
