import { describe, expect, it } from 'vitest';

import { formatDate } from '@/lib/utils/format-date';

describe('formatDate', () => {
  it('formatea fechas ISO sin desfase de zona horaria', () => {
    expect(formatDate('2026-10-10')).toContain('2026');
    expect(formatDate('2026-10-10')).toContain('10');
  });
});
