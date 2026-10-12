import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useMemo, useState, type KeyboardEvent } from 'react';

import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import { buildPalette } from '@/lib/search/palette-items';
import type { PaletteGroup, PaletteItem } from '@/lib/search/palette-types';
import { useTheme } from '@/lib/theme/theme-context';

import { runPaletteAction } from './run-palette-action';

type PaletteControllerInput = {
  initialQuery: string;
  onClose: () => void;
};

export type PaletteController = {
  activeItem: PaletteItem | undefined;
  groups: PaletteGroup[];
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  highlight: (itemId: string) => void;
  itemCount: number;
  query: string;
  run: (item: PaletteItem) => void;
  setQuery: (value: string) => void;
};

/**
Estado y teclado de la paleta: consulta, elemento activo y ejecución de acciones.
*/
export function usePaletteController({
  initialQuery,
  onClose,
}: PaletteControllerInput): PaletteController {
  const locale = useLocale();
  const messages = useMessages();
  const { preference, setPreference } = useTheme();
  const navigate = useNavigate();
  const location = useRouterState({ select: (state) => state.location });
  const [query, setQuery] = useState(initialQuery);
  const [activeIndex, setActiveIndex] = useState(0);

  const groups = useMemo(
    () => buildPalette(query, { locale, messages, theme: preference }),
    [query, locale, messages, preference],
  );
  const items = useMemo(() => groups.flatMap((group) => group.items), [groups]);
  const currentIndex = Math.min(activeIndex, Math.max(items.length - 1, 0));
  const activeItem = items[currentIndex];

  function changeQuery(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  function run(item: PaletteItem) {
    if (item.action.type === 'tag') {
      changeQuery(`#${item.action.tag} `);

      return;
    }

    onClose();
    runPaletteAction(item.action, {
      locale,
      navigate,
      pathname: location.pathname,
      search: location.search,
      setTheme: setPreference,
    });
  }

  function move(step: number) {
    if (items.length > 0) {
      setActiveIndex((currentIndex + step + items.length) % items.length);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      move(event.key === 'ArrowDown' ? 1 : -1);
    } else if (activeItem !== undefined && event.key === 'Enter') {
      event.preventDefault();
      run(activeItem);
    }
  }

  function highlight(itemId: string) {
    const index = items.findIndex((item) => item.id === itemId);

    if (index !== -1) {
      setActiveIndex(index);
    }
  }

  return {
    activeItem,
    groups,
    handleKeyDown,
    highlight,
    itemCount: items.length,
    query,
    run,
    setQuery: changeQuery,
  };
}
