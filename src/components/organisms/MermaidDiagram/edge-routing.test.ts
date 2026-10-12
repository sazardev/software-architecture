import { describe, expect, it } from 'vitest';

import { routeEdges, type RoutableNode } from './edge-routing';

function rect(x: number, y: number, halfW = 50, halfH = 20): RoutableNode {
  return { halfH, halfW, shape: 'rect', x, y };
}

function numbers(path: string): number[] {
  return path
    .matchAll(/-?\d+(?:\.\d+)?/g)
    .map((match) => Number(match[0]))
    .toArray();
}

function startOf(path: string): { x: number; y: number } {
  const [x = 0, y = 0] = numbers(path);

  return { x, y };
}

function endOf(path: string): { x: number; y: number } {
  const values = numbers(path);

  return { x: values.at(-2) ?? 0, y: values.at(-1) ?? 0 };
}

describe('routeEdges', () => {
  it('une dos nodos alineados con una recta entre sus bordes', () => {
    const nodes = new Map([
      ['a', rect(0, 0)],
      ['b', rect(0, 200)],
    ]);
    const [route] = routeEdges(nodes, [{ from: 'a', to: 'b' }]);

    expect(route?.path).toBe('M0 20L0 180');
  });

  it('reparte los puertos cuando dos conectores salen del mismo lado', () => {
    const nodes = new Map([
      ['a', rect(0, 0)],
      ['b', rect(-150, 200)],
      ['c', rect(150, 200)],
    ]);
    const [toB, toC] = routeEdges(nodes, [
      { from: 'a', to: 'b' },
      { from: 'a', to: 'c' },
    ]);

    expect(startOf(toB?.path ?? '').x).toBeLessThan(startOf(toC?.path ?? '').x);
  });

  it('toca el vértice real de un rombo y no su caja', () => {
    const nodes = new Map<string, RoutableNode>([
      ['a', { halfH: 40, halfW: 60, shape: 'diamond', x: 0, y: 0 }],
      ['b', rect(0, 200)],
    ]);
    const [route] = routeEdges(nodes, [{ from: 'a', to: 'b' }]);

    expect(startOf(route?.path ?? '').y).toBe(40);
  });

  it('prueba el otro eje cuando la ruta preferida cruzaría un nodo', () => {
    const nodes = new Map<string, RoutableNode>([
      ['s', { halfH: 60, halfW: 60, shape: 'diamond', x: 1130, y: 250 }],
      ['b', rect(756, 515, 43, 16)],
      ['c', rect(853, 515, 36, 16)],
    ]);
    const [toB] = routeEdges(nodes, [{ from: 's', to: 'b' }]);

    // Por la derecha de b tendría que atravesar c; entra por arriba (y = 515 - 16).
    expect(endOf(toB?.path ?? '').y).toBe(499);
  });

  it('ignora bucles y nodos desconocidos', () => {
    const nodes = new Map([['a', rect(0, 0)]]);

    expect(
      routeEdges(nodes, [
        { from: 'a', to: 'a' },
        { from: 'a', to: 'x' },
      ]),
    ).toEqual([null, null]);
  });
});
