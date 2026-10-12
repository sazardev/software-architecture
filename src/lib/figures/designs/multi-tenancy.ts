import {
  arrow,
  circle,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  node,
  pulse,
  rect,
} from '../figure-kit';
import type { Figure } from '../figure-types';

// Frontera de aislamiento: separa el pool compartido del silo dedicado y cruza la app común.
const BOUNDARY_X = 400;

const tenants = [
  { letter: 'A', x: 150 },
  { letter: 'B', x: 270 },
  { letter: 'C', x: 510 },
] as const;

const ROW_TOPS = [262, 284, 306, 328] as const;

function tableRows(x: number, w: number, letters: readonly string[], isBrand: boolean) {
  return ROW_TOPS.map((top, index) => {
    const letter = letters[index] ?? '';
    const isTenantA = letter === 'A';

    return group([
      rect(x, top, w, 18, {
        fill: isTenantA ? 'brandSoft' : 'paper',
        r: 2,
        stroke: isBrand ? 'brand' : 'muted',
        width: 1,
      }),
      label(x + 12, top + 13, letter, { size: 11, tone: 'ink', tracking: 0 }),
      line(x + 28, top + 9, x + w - 12, top + 9, { dash: '2 4', stroke: 'muted', width: 1 }),
    ]);
  });
}

export function multiTenancy(): Figure {
  return figure(
    // Los clientes entran por la misma puerta.
    label(40, 63, 'TENANT', { anchor: 'start' }),
    tenants.map((tenant, index) =>
      group(
        [
          circle(tenant.x, 58, 20, { fill: 'paper', width: 1.6 }),
          heading(tenant.x, 64, tenant.letter, { size: 18 }),
          arrow(
            [
              [tenant.x, 80],
              [tenant.x, 128],
            ],
            { tone: 'muted', width: 1.3 },
          ),
        ],
        motion('rise', index * 120),
      ),
    ),
    // Una sola aplicación para todos: el contexto del tenant viaja con cada petición.
    group(
      [
        rect(60, 130, 520, 56, { fill: 'paper', r: 6, width: 1.6 }),
        heading(320, 164, 'APP', { font: 'mono', size: 14, tracking: 3 }),
      ],
      motion('rise', 300),
    ),
    group(
      [
        arrow(
          [
            [210, 188],
            [210, 248],
          ],
          { tone: 'ink', width: 1.3 },
        ),
        label(220, 222, 'tenant_id', { anchor: 'start', size: 10.5, tracking: 0.6 }),
        arrow(
          [
            [510, 188],
            [510, 248],
          ],
          { tone: 'ink', width: 1.3 },
        ),
      ],
      motion('fade', 500),
    ),
    // Pool: una base compartida, filas de varios tenants filtradas por política.
    group(
      [
        rect(60, 250, 300, 124, { fill: 'paper', r: 6, width: 1.6 }),
        ...tableRows(76, 268, ['A', 'B', 'A', 'B'], false),
        label(344, 364, 'RLS', { anchor: 'end', size: 10 }),
        label(210, 392, 'POOL', { tone: 'ink', tracking: 3 }),
      ],
      motion('rise', 600),
    ),
    // Silo: base dedicada para el tenant que exige aislamiento fuerte.
    group(
      [
        rect(440, 250, 140, 124, { fill: 'paper', r: 6, width: 1.6 }),
        ...tableRows(456, 108, ['C', 'C', 'C', 'C'], true),
        label(510, 392, 'SILO', { tone: 'ink', tracking: 3 }),
      ],
      motion('rise', 750),
    ),
    // La frontera de aislamiento: el único acento.
    line(BOUNDARY_X, 104, BOUNDARY_X, 384, { opacity: 0.4, stroke: 'muted', width: 1.2 }),
    line(BOUNDARY_X, 104, BOUNDARY_X, 384, {
      dash: '5 7',
      motion: motion('flow'),
      stroke: 'accent',
      width: 1.9,
    }),
    pulse(BOUNDARY_X, 218, 12, 900),
    node(BOUNDARY_X, 218, 5, true),
  );
}
