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

/**
Índice curado para LLMs (https://llmstxt.org); se genera en el postbuild.
*/
export function llmsPath(locale: Locale): string {
  return `${locale}/llms.txt`;
}

export function llmsUrl(locale: Locale): string {
  return absoluteUrl(llmsPath(locale));
}

export function llmsFullPath(locale: Locale): string {
  return `${locale}/llms-full.txt`;
}

export function llmsFullUrl(locale: Locale): string {
  return absoluteUrl(llmsFullPath(locale));
}
