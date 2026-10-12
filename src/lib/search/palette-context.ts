import { createContext, use } from 'react';

export type CommandPaletteContextValue = {
  close: () => void;
  initialQuery: string;
  isOpen: boolean;
  /**
  Abre la paleta, opcionalmente con una consulta inicial (por ejemplo `#etiqueta`).
  */
  open: (query?: string) => void;
};

export const CommandPaletteContext = createContext<CommandPaletteContextValue>({
  close: () => {
    /*
    sin provider montado
    */
  },
  initialQuery: '',
  isOpen: false,
  open: () => {
    /*
    sin provider montado
    */
  },
});

export function useCommandPalette(): CommandPaletteContextValue {
  return use(CommandPaletteContext);
}
