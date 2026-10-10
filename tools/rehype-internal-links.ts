import type { Root } from 'hast';
import { visit } from 'unist-util-visit';

type RehypeInternalLinksOptions = {
  base: string;
};

const contentLocalePattern = /\/content\/docs\/([^/]+)\//;

function normalizeBase(base: string): string {
  return base.replace(/\/+$/, '');
}

export function rehypeInternalLinks(options: RehypeInternalLinksOptions) {
  const base = normalizeBase(options.base);

  return (tree: Root, file?: { path?: string }): void => {
    const locale = file?.path === undefined ? undefined : contentLocalePattern.exec(file.path)?.[1];
    const localePrefix = locale === undefined ? '' : `/${locale}`;
    const prefix = `${base}${localePrefix}`;
    if (prefix === '') {
      return;
    }

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') {
        return;
      }

      const href = node.properties.href;

      if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
        node.properties.href = `${prefix}${href}`;
      }
    });
  };
}
