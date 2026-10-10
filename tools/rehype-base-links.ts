import type { Root } from 'hast';
import { visit } from 'unist-util-visit';

type RehypeBaseLinksOptions = {
  base: string;
};

function normalizeBase(base: string): string {
  return base.replace(/\/+$/, '');
}

export function rehypeBaseLinks(options: RehypeBaseLinksOptions) {
  const base = normalizeBase(options.base);

  return (tree: Root): void => {
    if (base === '') {
      return;
    }

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') {
        return;
      }

      const href = node.properties.href;

      if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
        node.properties.href = `${base}${href}`;
      }
    });
  };
}
