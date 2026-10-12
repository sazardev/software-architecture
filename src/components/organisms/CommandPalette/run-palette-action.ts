import type { useNavigate } from '@tanstack/react-router';

import type { Locale } from '@/lib/i18n/locales';
import { switchLocalePath } from '@/lib/i18n/locales';
import type { PaletteAction } from '@/lib/search/palette-types';
import type { ThemePreference } from '@/lib/theme/themes';

type Navigate = ReturnType<typeof useNavigate>;

export type PaletteActionRuntime = {
  locale: Locale;
  navigate: Navigate;
  pathname: string;
  search: unknown;
  setTheme: (preference: ThemePreference) => void;
};

/**
Ejecuta una acción de la paleta que no es de filtrado (las etiquetas las gestiona la propia paleta).
*/
export function runPaletteAction(action: PaletteAction, runtime: PaletteActionRuntime): void {
  const { locale, navigate } = runtime;

  switch (action.type) {
    case 'doc': {
      void navigate({
        params: { locale, slug: action.slug },
        to: '/$locale/docs/$slug',
        ...(action.hash !== undefined && { hash: action.hash }),
      });
      break;
    }
    case 'page': {
      void navigate(
        action.page === 'home'
          ? { params: { locale }, to: '/$locale' }
          : { params: { locale }, to: '/$locale/docs' },
      );
      break;
    }
    case 'section': {
      void navigate({
        params: { locale },
        search: { category: action.sectionId },
        to: '/$locale/docs',
      });
      break;
    }
    case 'locale': {
      void navigate({
        search: runtime.search as never,
        to: switchLocalePath(runtime.pathname, action.locale) as never,
      });
      break;
    }
    case 'theme': {
      runtime.setTheme(action.next);
      break;
    }
    case 'tag': {
      break;
    }
  }
}
