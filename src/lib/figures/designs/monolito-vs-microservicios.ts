import { circle, figure, group, label, line, motion, poly, pulse, type Point } from '../figure-kit';
import { cube, slab } from '../figure-shapes';
import type { Figure } from '../figure-types';

const services: readonly Point[] = [
  [486, 158],
  [566, 178],
  [524, 234],
  [470, 252],
  [584, 266],
];

const links: readonly (readonly [number, number])[] = [
  [0, 1],
  [0, 3],
  [1, 2],
  [2, 3],
  [2, 4],
  [1, 4],
];

function captionFor(x: number, name: string, tag: string, delay: number) {
  return group(
    [
      label(x, 306, name, { size: 11.5, tone: 'ink', tracking: 2 }),
      label(x, 324, tag, { size: 10.5 }),
    ],
    motion('fade', delay),
  );
}

export function monolitoVsMicroservicios(): Figure {
  const modular = [
    { at: [320, 172] as Point, top: 'brandSoft' },
    { at: [286, 189] as Point, top: 'brandSoft' },
    { at: [354, 189] as Point, top: 'accentSoft' },
    { at: [320, 206] as Point, top: 'brandSoft' },
  ] as const;

  return figure(
    // 1. Monolito: una sola unidad de despliegue.
    cube(110, 150, 58, { left: 'brandMid', right: 'brandSoft', top: 'paper' }, motion('rise')),
    captionFor(110, 'MONOLITH', '1 DEPLOY', 300),
    // 2. Monolito modular: módulos con fronteras dentro del mismo proceso.
    group(
      [
        poly(
          [
            [320, 126],
            [398, 178],
            [320, 230],
            [242, 178],
          ],
          { dash: '4 4', stroke: 'muted', width: 1.2 },
          true,
        ),
        ...modular.map(({ at, top }, index) =>
          slab(
            at[0],
            at[1],
            34,
            17,
            16,
            { side: top === 'accentSoft' ? 'accentMid' : 'brandMid', top },
            motion('rise', 300 + index * 120),
          ),
        ),
      ],
      motion('fade', 200),
    ),
    captionFor(320, 'MODULAR MONOLITH', '1 DEPLOY', 500),
    // 3. Microservicios: piezas autónomas conectadas por red.
    links.map(([from, to], index) => {
      const a = services[from];
      const b = services[to];

      return a === undefined || b === undefined
        ? group([])
        : line(a[0], a[1], b[0], b[1], {
            dash: index % 2 === 0 ? '4 4' : undefined,
            stroke: 'muted',
            width: 1.2,
          });
    }),
    services.map(([x, y], index) =>
      cube(
        x,
        y,
        15,
        index === 2
          ? { left: 'accentMid', right: 'accentSoft', top: 'paper' }
          : { left: 'brandMid', right: 'brandSoft', top: 'paper' },
        motion('rise', 400 + index * 120),
      ),
    ),
    pulse(524, 234, 18, 1000),
    captionFor(530, 'MICROSERVICES', 'N DEPLOYS', 700),
    // Eje del espectro.
    group(
      [
        line(70, 368, 570, 368, { stroke: 'muted', width: 1.2 }),
        circle(70, 368, 4, { fill: 'paper', width: 1.4 }),
        poly(
          [
            [570, 368],
            [560, 363],
            [560, 373],
          ],
          { fill: 'muted', stroke: 'muted', width: 1 },
          true,
        ),
        label(70, 390, 'SIMPLE', { anchor: 'start' }),
        label(570, 390, 'AUTONOMY', { anchor: 'end' }),
      ],
      motion('fade', 1100),
    ),
  );
}
