import { site } from '@/lib/config/site';
import { absoluteUrl } from '@/lib/seo/absolute-url';

type HeadLinkEntry = {
  href: string;
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
  noindex?: boolean;
  path: string;
  title: string;
  type?: 'article' | 'website';
};

export function buildPageHead(input: PageHeadInput): PageHead {
  const type = input.type ?? 'website';
  const url = absoluteUrl(input.path);

  const meta: HeadMetaEntry[] = [
    { title: input.title },
    { content: input.description, name: 'description' },
    { content: type, property: 'og:type' },
    { content: input.title, property: 'og:title' },
    { content: input.description, property: 'og:description' },
    { content: url, property: 'og:url' },
    { content: site.name, property: 'og:site_name' },
    { content: 'summary', name: 'twitter:card' },
    { content: input.title, name: 'twitter:title' },
    { content: input.description, name: 'twitter:description' },
  ];

  if (input.noindex === true) {
    meta.push({ content: 'noindex, nofollow', name: 'robots' });
  }

  return { links: [{ href: url, rel: 'canonical' }], meta };
}
