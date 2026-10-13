import { describe, expect, it } from 'vitest';

import { buildFeed } from './feed';
import { headToHtml, jsonLdToHtml, renderPage } from './prerender';

const template = `<!doctype html>
<html lang="es" class="h-full">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content="base" />
    <title>Base</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

const seo = {
  head: {
    links: [{ href: 'https://x.test/en', hrefLang: 'en', rel: 'alternate' }],
    meta: [
      { title: 'Título & más' },
      { content: 'Descripción "clara"', name: 'description' },
      { content: 'website', property: 'og:type' },
    ],
  },
  jsonLd: ['{"name":"</script><b>"}'],
  noscript: { description: 'Desc', title: 'Título' },
};

describe('prerender', () => {
  it('serializa metas y links escapando atributos', () => {
    const html = headToHtml(seo.head);

    expect(html).toContain('<title data-prerender>Título &amp; más</title>');
    expect(html).toContain('content="Descripción &quot;clara&quot;"');
    expect(html).toContain('hreflang="en"');
  });

  it('neutraliza </script> dentro del JSON-LD', () => {
    expect(jsonLdToHtml(seo.jsonLd)).not.toContain('</script><b>');
    expect(jsonLdToHtml(seo.jsonLd)).toContain('</script>');
  });

  it('reemplaza título, descripción e idioma del template y añade noscript', () => {
    const page = renderPage(template, 'en', seo, 'https://x.test/en');

    expect(page).toContain('<html lang="en"');
    expect(page).not.toContain('<title>Base</title>');
    expect(page).not.toContain('content="base"');
    expect(page).toContain('<title data-prerender>');
    expect(page).toContain('<noscript>');
    expect(page.match(/<title/g)).toHaveLength(1);
  });

  it('incluye el cuerpo del artículo dentro del noscript', () => {
    const page = renderPage(template, 'es', seo, 'https://x.test/es', '<p>Cuerpo completo</p>');

    expect(page).toContain('<noscript>');
    expect(page).toContain('<p>Cuerpo completo</p>');
    expect(page).toContain('href="https://x.test/es"');
  });
});

describe('feed RSS', () => {
  it('lista los artículos del idioma con enlace, fecha y categoría', () => {
    const feed = buildFeed('es');

    expect(feed).toContain('<rss version="2.0"');
    expect(feed).toContain('<language>es</language>');
    expect(feed).toContain('<item>');
    expect(feed).toContain('<category>');
  });
});
