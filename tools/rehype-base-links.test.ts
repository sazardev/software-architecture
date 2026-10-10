import type { Element, Root } from 'hast';
import { describe, expect, it } from 'vitest';

import { rehypeBaseLinks } from './rehype-base-links';

function createTree(href: string): Root {
  return {
    children: [
      {
        children: [],
        properties: { href },
        tagName: 'a',
        type: 'element',
      },
    ],
    type: 'root',
  };
}

function readHref(tree: Root): unknown {
  const [child] = tree.children;

  return child === undefined ? undefined : (child as Element).properties.href;
}

describe('rehypeBaseLinks', () => {
  it('prefija enlaces internos con el base path de Pages', () => {
    const tree = createTree('/docs/solid');

    rehypeBaseLinks({ base: '/software-architecture/' })(tree);

    expect(readHref(tree)).toBe('/software-architecture/docs/solid');
  });

  it('no toca enlaces externos, protocolo-relativos ni anclas', () => {
    const external = createTree('https://example.com/x');
    const protocolRelative = createTree('//cdn.example.com/x');
    const anchor = createTree('#seccion');

    const transform = rehypeBaseLinks({ base: '/software-architecture/' });
    transform(external);
    transform(protocolRelative);
    transform(anchor);

    expect(readHref(external)).toBe('https://example.com/x');
    expect(readHref(protocolRelative)).toBe('//cdn.example.com/x');
    expect(readHref(anchor)).toBe('#seccion');
  });

  it('no modifica nada cuando el base es la raíz', () => {
    const tree = createTree('/docs/solid');

    rehypeBaseLinks({ base: '/' })(tree);

    expect(readHref(tree)).toBe('/docs/solid');
  });
});
