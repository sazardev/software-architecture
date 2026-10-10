import type { Element, Root } from 'hast';
import { describe, expect, it } from 'vitest';

import { rehypeInternalLinks } from './rehype-internal-links';

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

const spanishFile = { path: '/project/src/content/docs/es/solid.mdx' };
const englishFile = { path: '/project/src/content/docs/en/solid.mdx' };

describe('rehypeInternalLinks', () => {
  it('prefija base path e idioma en producción', () => {
    const tree = createTree('/docs/solid');

    rehypeInternalLinks({ base: '/software-architecture/' })(tree, spanishFile);

    expect(readHref(tree)).toBe('/software-architecture/es/docs/solid');
  });

  it('prefija solo el idioma en desarrollo', () => {
    const tree = createTree('/docs/solid');

    rehypeInternalLinks({ base: '/' })(tree, englishFile);

    expect(readHref(tree)).toBe('/en/docs/solid');
  });

  it('no toca enlaces externos, protocolo-relativos ni anclas', () => {
    const external = createTree('https://example.com/x');
    const protocolRelative = createTree('//cdn.example.com/x');
    const anchor = createTree('#seccion');

    const transform = rehypeInternalLinks({ base: '/software-architecture/' });
    transform(external, spanishFile);
    transform(protocolRelative, spanishFile);
    transform(anchor, spanishFile);

    expect(readHref(external)).toBe('https://example.com/x');
    expect(readHref(protocolRelative)).toBe('//cdn.example.com/x');
    expect(readHref(anchor)).toBe('#seccion');
  });

  it('no modifica nada sin base ni idioma detectado', () => {
    const tree = createTree('/docs/solid');

    rehypeInternalLinks({ base: '/' })(tree, { path: '/project/other/file.mdx' });

    expect(readHref(tree)).toBe('/docs/solid');
  });
});
