import type { Locale } from '@/lib/i18n/locales';
import type { Messages } from '@/lib/i18n/messages';
import type { ThemePreference } from '@/lib/theme/themes';

export type PaletteGroupId = 'docs' | 'navigation' | 'settings' | 'tags' | 'topics';

/**
Intención de un elemento de la paleta; la UI decide cómo ejecutarla (navegar, cambiar tema…).
*/
export type PaletteAction =
  | { hash: string | undefined; slug: string; type: 'doc' }
  | { locale: Locale; type: 'locale' }
  | { page: 'docs' | 'home'; type: 'page' }
  | { sectionId: string; type: 'section' }
  | { tag: string; type: 'tag' }
  | { next: ThemePreference; type: 'theme' };

export type PaletteItem = {
  action: PaletteAction;
  /**
  Segunda línea: descripción del documento o encabezado coincidente.
  */
  detail: string | undefined;
  id: string;
  label: string;
  /**
  Texto secundario alineado a la derecha (sección, recuento…).
  */
  meta: string | undefined;
};

export type PaletteGroup = {
  id: PaletteGroupId;
  items: PaletteItem[];
  label: string;
};

export type PaletteContext = {
  locale: Locale;
  messages: Messages;
  theme: ThemePreference;
};
