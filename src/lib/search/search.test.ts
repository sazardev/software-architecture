import { describe, expect, it } from 'vitest';

import { searchDocs } from '@/lib/search/search';

describe('searchDocs', () => {
  it('encuentra por título ignorando mayúsculas', () => {
    const results = searchDocs('SOLID', { locale: 'es' });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.entry.slug).toBe('solid');
  });

  it('ignora acentos y devuelve el ancla del encabezado en español', () => {
    const results = searchDocs('sustitucion', { locale: 'es' });

    expect(results[0]?.entry.slug).toBe('solid');
    expect(results[0]?.heading?.id).toBe('principio-de-sustitución-de-liskov');
  });

  it('busca sobre las anclas del idioma correspondiente', () => {
    const english = searchDocs('liskov', { locale: 'en' });

    expect(english[0]?.entry.slug).toBe('solid');
    expect(english[0]?.heading?.id).toBe('liskov-substitution-principle');
  });

  it('aísla los resultados por idioma', () => {
    expect(searchDocs('sustitucion', { locale: 'en' })).toEqual([]);
  });

  it('encuentra por tag', () => {
    const slugs = searchDocs('refactoring', { locale: 'es' }).map((result) => result.entry.slug);

    expect(slugs).toContain('clean-code');
  });

  it('filtra por categoría', () => {
    const results = searchDocs('', { category: 'practicas', locale: 'es' });

    expect(results.map((result) => result.entry.slug)).toContain('clean-code');
    expect(results.every((result) => result.entry.category === 'practicas')).toBe(true);
  });

  it('filtra por tag sin consulta', () => {
    const results = searchDocs('', { locale: 'en', tag: 'diagrams' });

    expect(results.map((result) => result.entry.slug)).toEqual(['c4-model']);
  });

  it('devuelve vacío cuando no hay coincidencias', () => {
    expect(searchDocs('zzz-inexistente', { locale: 'es' })).toEqual([]);
  });
});
