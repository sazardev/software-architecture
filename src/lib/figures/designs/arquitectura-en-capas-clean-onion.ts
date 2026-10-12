import { arrow, circle, figure, group, label, line, motion, node, pulse } from '../figure-kit';
import type { Figure } from '../figure-types';

const CX = 300;
const CY = 200;
const CALLOUT_ANGLE = (-38 * Math.PI) / 180;

const rings = [
  { fill: 'sunken', name: 'FRAMEWORKS', r: 168 },
  { fill: 'brandSoft', name: 'ADAPTERS', r: 128 },
  { fill: 'brandMid', name: 'USE CASES', r: 88 },
  { fill: 'accentSoft', name: 'ENTITIES', r: 48 },
] as const;

// Llamada a un anillo: punto sobre su banda y línea guía hasta la etiqueta.
function callout(name: string, radius: number, delay: number) {
  const px = CX + (radius - 20) * Math.cos(CALLOUT_ANGLE);
  const py = CY + (radius - 20) * Math.sin(CALLOUT_ANGLE);

  return group(
    [
      line(px, py, 482, py, { dash: '2 4', stroke: 'muted', width: 1 }),
      circle(px, py, 3, { fill: 'ink', width: 1 }),
      label(490, py + 4, name, { anchor: 'start' }),
    ],
    motion('fade', delay),
  );
}

export function arquitecturaEnCapasCleanOnion(): Figure {
  return figure(
    line(CX, 8, CX, 392, { dash: '14 4 2 4', stroke: 'faint', width: 1 }),
    rings.map((ring, index) =>
      group([circle(CX, CY, ring.r, { fill: ring.fill, width: 1.6 })], motion('rise', index * 140)),
    ),
    circle(CX, CY, 18, { fill: 'accent', width: 1.6 }),
    pulse(CX, CY, 20, 600),
    // Regla de dependencia: todo apunta hacia el centro.
    group(
      [
        arrow(
          [
            [28, CY],
            [CX - 20, CY],
          ],
          { flow: true, tone: 'accent', width: 2 },
        ),
        ...rings.map((ring) => node(CX - ring.r, CY, 3.5)),
        label(76, CY - 14, 'DEPENDS ON'),
      ],
      motion('fade', 700),
    ),
    rings.map((ring, index) => callout(ring.name, ring.r, 1000 + index * 120)),
  );
}
