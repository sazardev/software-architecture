import { describe, expect, it } from 'vitest';

import { searchDocs } from '@/lib/search/search';

describe('searchDocs', () => {
  it('encuentra por título ignorando mayúsculas', () => {
    const results = searchDocs('SOLID');

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.entry.slug).toBe('solid');
  });

  it('ignora acentos en la consulta y devuelve el ancla del encabezado', () => {
    const results = searchDocs('sustitucion');

    expect(results[0]?.entry.slug).toBe('solid');
    expect(results[0]?.heading?.id).toBe('principio-de-sustitución-de-liskov');
  });

  it('encuentra por tag', () => {
    const slugs = searchDocs('refactoring').map((result) => result.entry.slug);

    expect(slugs).toContain('clean-code');
  });

  it('filtra por categoría', () => {
    const results = searchDocs('', { category: 'practicas' });

    expect(results.map((result) => result.entry.slug)).toEqual(['clean-code']);
  });

  it('filtra por tag sin consulta', () => {
    const results = searchDocs('', { tag: 'diagramas' });

    expect(results.map((result) => result.entry.slug)).toEqual(['c4-model']);
  });

  it('devuelve vacío cuando no hay coincidencias', () => {
    expect(searchDocs('zzz-inexistente')).toEqual([]);
  });
});
