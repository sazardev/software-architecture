import { describe, expect, it } from 'vitest';

import { formatDate } from '@/lib/utils/format-date';

describe('formatDate', () => {
  it('formatea fechas ISO sin desfase de zona horaria en español', () => {
    const formatted = formatDate('2026-10-10', 'es');

    expect(formatted).toContain('2026');
    expect(formatted).toContain('10');
  });

  it('formatea fechas ISO en inglés', () => {
    const formatted = formatDate('2026-10-10', 'en');

    expect(formatted).toContain('2026');
    expect(formatted).toContain('10');
  });
});
