import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  clearSteps,
  getProgressSnapshot,
  parseProgress,
  ROADMAP_PROGRESS_KEY,
  setStepDone,
  subscribeProgress,
} from '@/lib/roadmap/roadmap-progress';

describe('progreso del roadmap', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('tolera valores corruptos en el almacenamiento', () => {
    expect(parseProgress(null).size).toBe(0);
    expect(parseProgress('{no json').size).toBe(0);
    expect(parseProgress('{"a":1}').size).toBe(0);
    expect([...parseProgress('["solid", 3, "adr"]')]).toEqual(['solid', 'adr']);
  });

  it('marca, desmarca y limpia pasos notificando a los suscriptores', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeProgress(listener);

    setStepDone('solid', true);
    setStepDone('adr', true);
    expect(getProgressSnapshot().has('solid')).toBe(true);
    expect(localStorage.getItem(ROADMAP_PROGRESS_KEY)).toBe('["adr","solid"]');

    setStepDone('solid', false);
    expect(getProgressSnapshot().has('solid')).toBe(false);

    clearSteps(['adr']);
    expect(getProgressSnapshot().size).toBe(0);
    expect(listener).toHaveBeenCalledTimes(4);

    unsubscribe();
  });

  it('devuelve la misma instantánea mientras no cambie el almacenamiento', () => {
    setStepDone('solid', true);

    expect(getProgressSnapshot()).toBe(getProgressSnapshot());
  });
});
