import { describe, expect, it } from 'vitest';

import { cn } from '@/lib/utils/cn';

describe('cn', () => {
  it('combina clases independientes', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('resuelve conflictos de Tailwind conservando la última clase', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('ignora valores falsy', () => {
    expect(cn('px-2', false, undefined, null)).toBe('px-2');
  });
});
