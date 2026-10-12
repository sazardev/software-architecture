import { useMessages } from '@/lib/i18n/use-messages';
import { useCommandPalette } from '@/lib/search/palette-context';
import { isApplePlatform } from '@/lib/utils/platform';

/**
Botón del encabezado que abre la paleta de comandos: icono en móvil, campo con atajo desde `md`.
*/
export function CommandPaletteTrigger() {
  const messages = useMessages();
  const { open } = useCommandPalette();
  const shortcut = isApplePlatform() ? '⌘K' : 'Ctrl K';

  return (
    <button
      aria-haspopup="dialog"
      aria-keyshortcuts="Control+K Meta+K /"
      aria-label={messages.palette.open}
      className="inline-flex h-8 w-8 items-center justify-center gap-2 rounded-full border border-neutral-200 font-sans text-sm text-neutral-600 transition-colors duration-300 hover:border-neutral-900 hover:text-neutral-900 md:w-auto md:min-w-44 md:justify-between md:pr-2 md:pl-3.5 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-300 dark:hover:text-neutral-50"
      onClick={() => {
        open();
      }}
      title={`${messages.palette.open} (${shortcut})`}
      type="button"
    >
      <span className="flex items-center gap-2">
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="hidden md:inline">{messages.palette.trigger}</span>
      </span>
      <kbd className="hidden rounded-md border border-neutral-300 px-1.5 py-0.5 font-mono text-[0.68rem] leading-none text-neutral-500 md:inline dark:border-neutral-700 dark:text-neutral-400">
        {shortcut}
      </kbd>
    </button>
  );
}
