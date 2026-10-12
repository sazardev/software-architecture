import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import {
  CommandPaletteContext,
  type CommandPaletteContextValue,
} from '@/lib/search/palette-context';
import { isTypingTarget } from '@/lib/utils/is-typing-target';

type PaletteState = {
  initialQuery: string;
  isOpen: boolean;
};

type CommandPaletteProviderProps = Readonly<{
  children: ReactNode;
}>;

const closedState: PaletteState = { initialQuery: '', isOpen: false };

function isToggleShortcut(event: KeyboardEvent): boolean {
  return event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey) && !event.altKey;
}

function isSlashShortcut(event: KeyboardEvent): boolean {
  return (
    event.key === '/' &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !isTypingTarget(event.target)
  );
}

/**
Estado de la paleta de comandos y atajos globales: `Ctrl/⌘ + K` (alterna) y `/` (abre).
*/
export function CommandPaletteProvider({ children }: CommandPaletteProviderProps) {
  const [state, setState] = useState<PaletteState>(closedState);

  const open = useCallback((query = '') => {
    setState({ initialQuery: query, isOpen: true });
  }, []);

  const close = useCallback(() => {
    setState((previous) => (previous.isOpen ? closedState : previous));
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) {
        return;
      }

      if (isToggleShortcut(event)) {
        event.preventDefault();
        setState((previous) => (previous.isOpen ? closedState : { ...closedState, isOpen: true }));
      } else if (isSlashShortcut(event)) {
        event.preventDefault();
        setState({ ...closedState, isOpen: true });
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const value = useMemo<CommandPaletteContextValue>(
    () => ({ close, initialQuery: state.initialQuery, isOpen: state.isOpen, open }),
    [close, open, state.initialQuery, state.isOpen],
  );

  return <CommandPaletteContext value={value}>{children}</CommandPaletteContext>;
}
