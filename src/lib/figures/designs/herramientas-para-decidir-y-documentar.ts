import {
  arrow,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  node,
  poly,
  pulse,
  rect,
} from '../figure-kit';
import type { Figure } from '../figure-types';

// Embudo: muchas candidatas arriba, cada criterio filtra; abajo queda una herramienta y su ADR.
const cx = 320;
const top = 64;
const bottom = 314;
const topHalf = 214;
const bottomHalf = 40;
const halfAt = (y: number): number =>
  topHalf - ((y - top) * (topHalf - bottomHalf)) / (bottom - top);

// Criterios del marco, de arriba abajo, con el peso del ejemplo trabajado.
const filters = [
  { name: 'SSO · RBAC', weight: '×2' },
  { name: 'API', weight: '×3' },
  { name: 'JSON · MD', weight: '×2' },
  { name: 'QUERY', weight: '×2' },
  { name: 'LOCK-IN', weight: '×3' },
] as const;

const bandHeight = (bottom - top) / filters.length;
const candidates = [148, 204, 262, 320, 378, 436, 492];
const rejectedAt = [0, 1, 2, 3];

function band(index: number) {
  const y1 = top + index * bandHeight;
  const y2 = y1 + bandHeight;
  const mid = (y1 + y2) / 2;
  const isHot = index === filters.length - 1;
  const filter = filters[index] ?? filters[0];
  const edge = cx + halfAt(mid);

  const outline = [
    [cx - halfAt(y1), y1],
    [cx + halfAt(y1), y1],
    [cx + halfAt(y2), y2],
    [cx - halfAt(y2), y2],
  ] as const;

  return group(
    [
      poly(
        outline,
        {
          fill: isHot ? 'accentSoft' : 'brandSoft',
          opacity: isHot ? 0.9 : 0.45 + index * 0.12,
          stroke: undefined,
        },
        true,
      ),
      poly(outline, { stroke: isHot ? 'accent' : 'ink', width: isHot ? 1.8 : 1.4 }, true),
      label(cx, mid + 4, filter.name, { size: 11.5, tone: 'ink' }),
      line(edge + 10, mid, 566, mid, {
        dash: '2 4',
        stroke: isHot ? 'accent' : 'muted',
        width: 1,
      }),
      label(592, mid + 4, filter.weight, { size: 12, tone: isHot ? 'accent' : 'muted' }),
    ],
    motion('rise', 200 + index * 140),
  );
}

function rejected(index: number) {
  const mid = top + index * bandHeight + bandHeight / 2;
  const edge = cx - halfAt(mid);
  const x = 64 + index * 14;

  return group(
    [
      line(edge - 6, mid, x + 9, mid, { dash: '3 3', stroke: 'muted', width: 1 }),
      node(x, mid, 5, false, { stroke: 'muted', width: 1.2 }),
      label(x, mid - 12, '×', { size: 12 }),
    ],
    motion('fade', 900 + index * 120),
  );
}

export function herramientasParaDecidirYDocumentar(): Figure {
  return figure(
    // Candidatas que entran por arriba.
    group(
      candidates.flatMap((x) => [
        line(x, 42, x, 60, { dash: '2 4', stroke: 'muted', width: 1 }),
        node(x, 34, 6, false, { width: 1.4 }),
      ]),
      motion('fade', 100),
    ),
    label(cx, 18, 'N', { size: 11 }),
    filters.map((_, index) => band(index)),
    rejectedAt.map((index) => rejected(index)),
    // El último filtro, el que más se olvida: cuánto cuesta irse.
    pulse(cx + halfAt(bottom - bandHeight / 2) + 16, bottom - bandHeight / 2, 12, 1400),
    node(cx + halfAt(bottom - bandHeight / 2) + 16, bottom - bandHeight / 2, 4, true),
    arrow(
      [
        [cx, bottom],
        [cx, 344],
      ],
      { flow: true, tone: 'brand', width: 1.8 },
    ),
    group(
      [
        rect(cx - 46, 346, 92, 40, { fill: 'paper', r: 5, width: 1.6 }),
        heading(cx, 372, 'ADR', { font: 'mono', size: 14, tracking: 2 }),
      ],
      motion('rise', 1100),
    ),
    label(592, 50, 'w', { size: 11 }),
  );
}
