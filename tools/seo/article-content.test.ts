import { describe, expect, it } from 'vitest';

import { parseArticleBlocks, readDocBody } from './article-blocks';
import { parseInline, type ArticleInline } from './article-inline';
import { blocksToHtml, blocksToText } from './article-serializers';

const plain = (tokens: ArticleInline[]): string =>
  tokens
    .map((token) => token.text)
    .join('')
    .trim();

const body = `# Título

Intro con [enlace](/docs/solid#seccion) y \`código\`.

## Sección

- punto uno
- punto dos
  con continuación

<Callout tone="info" title="Aviso">
  Nota con **negrita**.
</Callout>

\`\`\`ts title="ejemplo.ts"
const valor = 1;
\`\`\`

> Una cita

| A | B |
| --- | --- |
| 1 | 2 |

<InteractiveMap
  center={[-3.7, 40.4]}
  zoom={5}
  markers={[{ label: 'Madrid' }]}
/>

Texto final con \`<T>\`.
`;

describe('parseArticleBlocks', () => {
  const blocks = parseArticleBlocks(body);

  it('extrae encabezados con el id de las anclas del sitio (sin el h1 del título)', () => {
    const headings = blocks.filter((block) => block.type === 'heading');

    expect(headings).toHaveLength(1);
    expect(headings[0]).toMatchObject({ id: 'sección', level: 2, text: 'Sección' });
  });

  it('agrupa listas con líneas de continuación', () => {
    const list = blocks.find((block) => block.type === 'list');

    expect(list).toMatchObject({
      items: [[{ text: 'punto uno' }], [{ text: 'punto dos con continuación' }]],
      ordered: false,
    });
  });

  it('conserva el contenido de los componentes MDX y descarta sus etiquetas', () => {
    const texts: string[] = [];

    for (const block of blocks) {
      if (block.type === 'paragraph') {
        texts.push(plain(block.content));
      }
    }

    expect(texts).toContain('Nota con negrita.');
    expect(texts.join(' ')).not.toContain('InteractiveMap');
    expect(texts.join(' ')).not.toContain('Callout');
  });

  it('parsea bloques de código con su lenguaje (sin el título)', () => {
    const code = blocks.find((block) => block.type === 'code');

    expect(code).toMatchObject({ language: 'ts', lines: ['const valor = 1;'] });
  });

  it('parsea citas y tablas con cabecera', () => {
    const quote = blocks.find((block) => block.type === 'quote');
    const table = blocks.find((block) => block.type === 'table');

    expect(quote).toMatchObject({ content: [{ text: 'Una cita' }] });
    expect(table).toMatchObject({
      hasHeader: true,
      rows: [
        [[{ text: 'A' }], [{ text: 'B' }]],
        [[{ text: '1' }], [{ text: '2' }]],
      ],
    });
  });
});

describe('parseInline', () => {
  it('separa enlaces y código del texto', () => {
    expect(parseInline('usa [esto](/docs/x) y `eso`')).toEqual([
      { text: 'usa ' },
      { href: '/docs/x', text: 'esto' },
      { text: ' y ' },
      { code: true, text: 'eso' },
    ]);
  });

  it('degrada imágenes a texto alternativo y limpia etiquetas JSX', () => {
    expect(parseInline('![Plano](/a.png) <span>fin</span>')).toEqual([
      { text: 'Plano' },
      { text: ' fin ' },
    ]);
  });
});

describe('serializadores', () => {
  const blocks = parseArticleBlocks(body);
  const options = { headingOffset: 2, locale: 'es', url: 'https://x.test/es/docs/demo' };

  it('texto: ancla los encabezados y localiza los enlaces internos', () => {
    const text = blocksToText(blocks, options);

    expect(text).toContain('#### [Sección](https://x.test/es/docs/demo#sección)');
    expect(text).toContain('/es/docs/solid#seccion)');
    expect(text).toContain('```ts\nconst valor = 1;\n```');
    expect(text).toContain('| --- | --- |');
  });

  it('html: escapa el contenido y conserva enlaces y código', () => {
    const html = blocksToHtml(blocks, 'es');

    expect(html).toContain('<h2 id="sección">Sección</h2>');
    expect(html).toContain('/es/docs/solid#seccion">enlace</a>');
    expect(html).toContain('<code>&lt;T&gt;</code>');
    expect(html).toContain('<th>A</th>');
    expect(html).not.toContain('<InteractiveMap');
    expect(html).not.toContain('<Callout');
  });
});

describe('readDocBody', () => {
  it('lee el cuerpo sin frontmatter de un artículo real', async () => {
    const source = await readDocBody('en', 'getting-started');

    expect(source.startsWith('---')).toBe(false);
    expect(source).toContain('## ');
  });
});
