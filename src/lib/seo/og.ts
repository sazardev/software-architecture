import type { Locale } from '@/lib/i18n/locales';
import { absoluteUrl } from '@/lib/seo/absolute-url';

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/**
Ruta relativa (dentro de dist) de la tarjeta social; se genera en el postbuild.
*/
export function ogImagePath(locale: Locale, slug = 'home'): string {
  return `og/${locale}/${slug}.png`;
}

export function ogImageUrl(locale: Locale, slug = 'home'): string {
  return absoluteUrl(ogImagePath(locale, slug));
}

export function feedPath(locale: Locale): string {
  return `${locale}/feed.xml`;
}

export function feedUrl(locale: Locale): string {
  return absoluteUrl(feedPath(locale));
}
