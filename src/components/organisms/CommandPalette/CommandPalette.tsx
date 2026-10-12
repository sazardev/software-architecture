import { useEffect, useLayoutEffect, useRef } from 'react';

import { useMessages } from '@/lib/i18n/use-messages';
import { useCommandPalette } from '@/lib/search/palette-context';

import { PaletteBody } from './PaletteBody';

/**
Paleta de comandos: búsqueda y navegación en un diálogo modal (`Ctrl/⌘ + K` o `/`).
Usa `<dialog>` nativo: trampa de foco, `Esc`, capa superior y `inert` en el resto de la página.
*/
export function CommandPalette() {
  const messages = useMessages();
  const { close, initialQuery, isOpen } = useCommandPalette();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;

    if (dialog === null) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;

    function handleBackdropClick(event: MouseEvent) {
      // Un clic sobre el fondo (::backdrop) llega con el propio diálogo como destino.
      if (event.target === dialog) {
        close();
      }
    }

    dialog?.addEventListener('click', handleBackdropClick);

    return () => {
      dialog?.removeEventListener('click', handleBackdropClick);
    };
  }, [close]);

  return (
    <dialog
      aria-label={messages.palette.dialogLabel}
      className="fixed inset-x-0 top-[6vh] mx-auto my-0 max-h-[min(36rem,calc(100dvh-3rem))] w-[min(42rem,calc(100vw-1.5rem))] flex-col overflow-hidden border border-neutral-900 bg-neutral-50 p-0 text-neutral-900 backdrop:bg-neutral-950/60 open:flex open:animate-pop sm:top-[12vh] dark:border-neutral-300 dark:bg-neutral-950 dark:text-neutral-100 dark:backdrop:bg-neutral-950/75"
      onClose={close}
      ref={dialogRef}
    >
      {isOpen ? <PaletteBody initialQuery={initialQuery} onClose={close} /> : null}
    </dialog>
  );
}
