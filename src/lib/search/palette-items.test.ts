import { describe, expect, it } from 'vitest';

import { getMessages } from '@/lib/i18n/messages';
import { buildPalette } from '@/lib/search/palette-items';
import type { PaletteContext } from '@/lib/search/palette-types';

const spanish: PaletteContext = { locale: 'es', messages: getMessages('es'), theme: 'system' };
const english: PaletteContext = { locale: 'en', messages: getMessages('en'), theme: 'dark' };

function groupIds(query: string): string[] {
  return buildPalette(query, spanish).map((group) => group.id);
}

describe('buildPalette', () => {
  it('sin consulta sugiere documentos, temas, etiquetas, navegación y ajustes', () => {
    expect(groupIds('')).toEqual(['docs', 'topics', 'tags', 'navigation', 'settings']);
  });

  it('limita los documentos sugeridos', () => {
    const docs = buildPalette('', spanish).find((group) => group.id === 'docs');

    expect(docs?.items.length).toBeGreaterThan(0);
    expect(docs?.items.length).toBeLessThanOrEqual(6);
  });

  it('busca documentos por texto y los pone primero', () => {
    const [first] = buildPalette('solid', spanish);

    expect(first?.id).toBe('docs');
    expect(first?.items[0]?.id).toBe('doc:solid');
  });

  it('enlaza al encabezado cuando la coincidencia está en una sección', () => {
    const docs = buildPalette('sustitucion', spanish).find((group) => group.id === 'docs');
    const action = docs?.items[0]?.action;

    expect(action).toMatchObject({
      hash: 'principio-de-sustitución-de-liskov',
      slug: 'solid',
      type: 'doc',
    });
  });

  it('un # solo lista únicamente etiquetas', () => {
    expect(groupIds('#')).toEqual(['tags']);
  });

  it('filtra los documentos de una etiqueta completa', () => {
    const [group] = buildPalette('#solid', spanish);

    expect(group?.id).toBe('docs');
    expect(group?.label).toBe(spanish.messages.palette.taggedWith('solid'));
    expect(group?.items.map((item) => item.id)).toContain('doc:solid');
  });

  it('devuelve una lista vacía si nada coincide', () => {
    expect(buildPalette('zzzzzz', spanish)).toEqual([]);
  });

  it('ofrece cambiar al siguiente tema y a los otros idiomas', () => {
    const settings = buildPalette('', spanish).find((group) => group.id === 'settings');

    expect(settings?.items.map((item) => item.action)).toEqual([
      { next: 'light', type: 'theme' },
      { locale: 'en', type: 'locale' },
    ]);
  });

  it('aísla los resultados por idioma', () => {
    const docs = buildPalette('principles', english).find((group) => group.id === 'docs');

    expect(docs?.items.map((item) => item.id)).toContain('doc:solid');
    expect(docs?.items.every((item) => item.label !== 'Principios SOLID')).toBe(true);
  });

  it('filtra las acciones por su etiqueta', () => {
    const ids = buildPalette('english', spanish).flatMap((group) =>
      group.items.map((item) => item.id),
    );

    expect(ids).toEqual(['locale:en']);
  });
});
