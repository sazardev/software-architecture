import { site } from '@/lib/config/site';
import {
  defaultLocale,
  getLocaleDefinition,
  locales,
  switchLocalePath,
  type Locale,
} from '@/lib/i18n/locales';
import { absoluteUrl } from '@/lib/seo/absolute-url';

type HeadLinkEntry = {
  href: string;
  hreflang?: string;
  rel: string;
};

type HeadMetaEntry = {
  content?: string;
  name?: string;
  property?: string;
  title?: string;
};

export type PageHead = {
  links: HeadLinkEntry[];
  meta: HeadMetaEntry[];
};

type PageHeadInput = {
  description: string;
  locale: Locale;
  noindex?: boolean;
  path: string;
  title: string;
  type?: 'article' | 'website';
};

export function buildPageHead(input: PageHeadInput): PageHead {
  const type = input.type ?? 'website';
  const url = absoluteUrl(input.path);
  const definition = getLocaleDefinition(input.locale);

  const alternateLinks: HeadLinkEntry[] = locales.map((code) => ({
    href: absoluteUrl(switchLocalePath(input.path, code)),
    hreflang: code,
    rel: 'alternate',
  }));

  alternateLinks.push({
    href: absoluteUrl(switchLocalePath(input.path, defaultLocale)),
    hreflang: 'x-default',
    rel: 'alternate',
  });

  const meta: HeadMetaEntry[] = [
    { title: input.title },
    { content: input.description, name: 'description' },
    { content: type, property: 'og:type' },
    { content: input.title, property: 'og:title' },
    { content: input.description, property: 'og:description' },
    { content: url, property: 'og:url' },
    { content: site.name, property: 'og:site_name' },
    { content: definition.ogLocale, property: 'og:locale' },
    ...locales
      .filter((code) => code !== input.locale)
      .map((code) => ({
        content: getLocaleDefinition(code).ogLocale,
        property: 'og:locale:alternate',
      })),
    { content: 'summary', name: 'twitter:card' },
    { content: input.title, name: 'twitter:title' },
    { content: input.description, name: 'twitter:description' },
  ];

  if (input.noindex === true) {
    meta.push({ content: 'noindex, nofollow', name: 'robots' });
  }

  return { links: [{ href: url, rel: 'canonical' }, ...alternateLinks], meta };
}
