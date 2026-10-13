import { describe, expect, it } from 'vitest';

import { buildLlmsFullTxt, buildLlmsRoot, buildLlmsTxt } from './llms';

describe('llms.txt', () => {
  it('genera índice por idioma con todos los artículos', () => {
    const txt = buildLlmsTxt('es');

    expect(txt).toContain('# Software Architecture');
    expect(txt).toContain('## Fundamentos');
    expect(txt).toMatch(/-\s\[.+\]\(https?:\/\/.+\/es\/docs\/.+\):\s.+/);
  });

  it('la versión full incluye el texto completo con encabezados anclados', async () => {
    const txt = await buildLlmsFullTxt('en');

    expect(txt).toContain('# Software Architecture (full)');
    expect(txt).toMatch(/#[a-z0-9-]+\)/);
    expect(txt).toContain('#### ');
    expect(txt).toContain('```');
  });

  it('la raíz descubre ambos idiomas, feeds y repo', () => {
    const txt = buildLlmsRoot();

    expect(txt).toContain('/es/llms.txt');
    expect(txt).toContain('/en/llms.txt');
    expect(txt).toContain('feed.xml');
    expect(txt).toContain('github.com');
  });
});
