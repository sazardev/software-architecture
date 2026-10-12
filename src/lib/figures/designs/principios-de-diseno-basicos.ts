import { arrow, figure, group, heading, label, line, motion, poly, rect } from '../figure-kit';
import type { Figure } from '../figure-types';

// Módulo que oculta una decisión: una cara pública (tax) y un interior (rates).
const MODULE = { h: 260, w: 196, x: 222, y: 64 } as const;
const PUBLIC = { h: 52, w: 140, x: 250, y: 136 } as const;
const HIDDEN = { h: 52, w: 140, x: 250, y: 240 } as const;

function caller(x: number, y: number, name: string, delay: number) {
  return group(
    [
      rect(x, y, 122, 52, { fill: 'paper', r: 5, width: 1.6 }),
      heading(x + 61, y + 32, name, { size: 15 }),
    ],
    motion('rise', delay),
  );
}

// Copia fantasma de la regla: lo que había antes de unificarla.
function ghost(y: number, delay: number) {
  const x = 500;
  return group(
    [
      rect(x, y, 86, 26, { dash: '3 3', opacity: 0.7, r: 3, stroke: 'muted', width: 1.2 }),
      label(x + 43, y + 17, 'tax()', { size: 10.5 }),
      line(x - 4, y + 13, x + 90, y + 13, { stroke: 'muted', width: 1.2 }),
    ],
    motion('fade', delay),
  );
}

export function principiosDeDisenoBasicos(): Figure {
  const midPublic = PUBLIC.y + PUBLIC.h / 2;
  const midHidden = HIDDEN.y + HIDDEN.h / 2;

  return figure(
    // Módulo con su decisión oculta.
    group(
      [
        rect(MODULE.x, MODULE.y, MODULE.w, MODULE.h, { fill: 'brandSoft', r: 8, width: 1.6 }),
        label(MODULE.x + MODULE.w / 2, MODULE.y + 30, 'PRICING', { tone: 'ink', tracking: 3 }),
        rect(HIDDEN.x, HIDDEN.y, HIDDEN.w, HIDDEN.h, {
          dash: '4 4',
          fill: 'paper',
          r: 4,
          stroke: 'muted',
          width: 1.3,
        }),
        label(HIDDEN.x + HIDDEN.w / 2, midHidden + 5, 'rates', { size: 13 }),
      ],
      motion('rise'),
    ),
    // La única representación de la regla: el acento de la figura.
    group(
      [
        rect(PUBLIC.x, PUBLIC.y, PUBLIC.w, PUBLIC.h, { fill: 'accent', r: 5, width: 1.8 }),
        heading(PUBLIC.x + PUBLIC.w / 2, midPublic + 7, 'tax()', { font: 'mono', size: 17 }),
      ],
      motion('rise', 250),
    ),
    caller(38, PUBLIC.y, 'Checkout', 400),
    arrow(
      [
        [160, midPublic],
        [PUBLIC.x, midPublic],
      ],
      { flow: true, tone: 'brand', width: 1.8 },
    ),
    // Dependencia directa al interior: cortada.
    group(
      [
        poly(
          [
            [99, PUBLIC.y + 52],
            [99, midHidden],
            [176, midHidden],
          ],
          { dash: '4 4', stroke: 'muted', width: 1.4 },
        ),
        arrow(
          [
            [200, midHidden],
            [HIDDEN.x, midHidden],
          ],
          { dash: '4 4', tone: 'muted', width: 1.4 },
        ),
        line(178, midHidden + 10, 186, midHidden - 10, { width: 1.8 }),
        line(188, midHidden + 10, 196, midHidden - 10, { width: 1.8 }),
        label(187, midHidden + 32, 'LoD', { size: 10.5 }),
      ],
      motion('fade', 700),
    ),
    // Dos llamadores que antes copiaban la regla y ahora la piden.
    caller(482, 84, 'Invoice', 500),
    caller(482, 262, 'Refund', 600),
    ghost(150, 900),
    ghost(222, 1000),
    arrow(
      [
        [482, 110],
        [444, 110],
        [444, midPublic - 8],
        [PUBLIC.x + PUBLIC.w, midPublic - 8],
      ],
      { width: 1.5 },
    ),
    arrow(
      [
        [482, 288],
        [452, 288],
        [452, midPublic + 8],
        [PUBLIC.x + PUBLIC.w, midPublic + 8],
      ],
      { width: 1.5 },
    ),
    label(543, 346, 'DRY', { tone: 'ink', tracking: 3 }),
    label(MODULE.x + MODULE.w / 2, 360, 'PARNAS · 1972', { size: 11 }),
  );
}
