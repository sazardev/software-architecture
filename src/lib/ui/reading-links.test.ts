import { describe, expect, it } from 'vitest';

import {
  buildQuote,
  commentIssueUrl,
  editUrl,
  pageUrl,
  shareUrl,
  textFragmentUrl,
} from '@/lib/ui/reading-links';

const source = {
  siteName: 'Sitio',
  title: 'Principios SOLID',
  url: 'https://x.test/es/docs/solid',
};

describe('enlaces de lectura', () => {
  it('compone la URL de la página sin hash ni query', () => {
    expect(pageUrl({ origin: 'https://x.test', pathname: '/es/docs/solid' })).toBe(
      'https://x.test/es/docs/solid',
    );
  });

  it('usa el texto completo en el fragmento cuando la selección es corta', () => {
    expect(textFragmentUrl('https://x.test/p', 'hola mundo')).toBe(
      'https://x.test/p#:~:text=hola%20mundo',
    );
  });

  it('usa inicio,fin en selecciones largas y escapa el guion', () => {
    const selection = 'uno dos tres cuatro cinco seis siete ocho nueve diez-once doce';
    const url = textFragmentUrl('https://x.test/p', selection);

    expect(url).toBe(
      'https://x.test/p#:~:text=uno%20dos%20tres%20cuatro,ocho%20nueve%20diez%2Donce%20doce',
    );
  });

  it('construye una cita con fuente y enlace', () => {
    const quote = buildQuote('  La   meta es\nclara ', source);

    expect(quote).toContain('“La meta es clara”');
    expect(quote).toContain('— Principios SOLID, Sitio');
    expect(quote).toContain('https://x.test/es/docs/solid#:~:text=');
  });

  it('prepara el issue de comentario con la selección citada', () => {
    const url = commentIssueUrl('https://github.com/o/r', 'una frase', source);

    expect(url.startsWith('https://github.com/o/r/issues/new?')).toBe(true);
    expect(decodeURIComponent(url.replaceAll('+', ' '))).toContain('> una frase');
  });

  it('genera URLs de compartir y de edición', () => {
    expect(shareUrl('x', 'https://x.test/p', 'T')).toContain('twitter.com/intent/tweet');
    expect(shareUrl('linkedin', 'https://x.test/p', 'T')).toContain('linkedin.com/sharing');
    expect(shareUrl('email', 'https://x.test/p', 'T').startsWith('mailto:')).toBe(true);
    expect(editUrl('https://github.com/o/r', 'es', 'solid')).toBe(
      'https://github.com/o/r/edit/main/src/content/docs/es/solid.mdx',
    );
  });
});
