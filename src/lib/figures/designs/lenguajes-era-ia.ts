import {
  arrow,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  path,
  pulse,
  rect,
} from '../figure-kit';
import type { Figure } from '../figure-types';

const tiles = [
  { isHot: true, name: 'TS' },
  { isHot: false, name: 'PY' },
  { isHot: false, name: 'GO' },
  { isHot: false, name: 'RS' },
  { isHot: false, name: 'JV' },
  { isHot: false, name: 'C#' },
] as const;

const TILE = 76;
const GAP = 18;
const GRID_X = 40;
const GRID_Y = 112;

// Destello de cuatro puntas centrado en (cx, cy) con radio r.
function spark(cx: number, cy: number, r: number): string {
  const k = r * 0.12;

  return `M${cx} ${cy - r}C${cx + k} ${cy - k} ${cx + k} ${cy - k} ${cx + r} ${cy}C${cx + k} ${cy + k} ${cx + k} ${cy + k} ${cx} ${cy + r}C${cx - k} ${cy + k} ${cx - k} ${cy + k} ${cx - r} ${cy}C${cx - k} ${cy - k} ${cx - k} ${cy - k} ${cx} ${cy - r}Z`;
}

export function lenguajesEraIa(): Figure {
  const mainSpark = path(spark(548, 200, 56), { fill: 'accent', width: 1.8 });
  const sparkles = [
    path(spark(596, 128, 18), { fill: 'accentSoft', stroke: 'accent', width: 1.4 }),
    path(spark(500, 292, 13), { fill: 'accentSoft', stroke: 'accent', width: 1.2 }),
  ];

  return figure(
    // Lenguajes como teclas con relieve.
    tiles.map((tile, index) => {
      const x = GRID_X + (index % 3) * (TILE + GAP);
      const y = GRID_Y + Math.floor(index / 3) * (TILE + GAP);

      return group(
        [
          rect(x, y + 7, TILE, TILE, {
            fill: tile.isHot ? 'accentMid' : 'brandMid',
            r: 10,
            width: 1.6,
          }),
          rect(x, y, TILE, TILE, { fill: tile.isHot ? 'accentSoft' : 'paper', r: 10, width: 1.6 }),
          heading(x + TILE / 2, y + TILE / 2 + 7, tile.name, {
            font: 'mono',
            size: 21,
            tracking: 1,
          }),
        ],
        motion('rise', index * 110),
      );
    }),
    // Los tipos como contrato entre lenguajes e IA.
    group(
      [
        rect(388, 70, 26, 260, { fill: 'brandSoft', r: 13, width: 1.7 }),
        line(401, 92, 401, 308, { dash: '2 4', stroke: 'brand', width: 1.2 }),
        label(401, 50, 'TYPES', { tone: 'ink', tracking: 3 }),
      ],
      motion('rise', 500),
    ),
    [140, 200, 260].map((y, index) =>
      group(
        [
          arrow(
            [
              [GRID_X + 3 * (TILE + GAP) - GAP + 10, y],
              [380, y],
            ],
            { flow: index === 1, tone: 'muted' },
          ),
          arrow(
            [
              [420, y],
              [488, 200 + (y - 200) * 0.45],
            ],
            { flow: true, tone: 'accent', width: 1.8 },
          ),
        ],
        motion('fade', 700 + index * 120),
      ),
    ),
    // La IA que lee y escribe código.
    group(
      [mainSpark, ...sparkles, label(548, 288, 'AI', { size: 12, tone: 'ink', tracking: 3 })],
      motion('rise', 900),
    ),
    pulse(548, 200, 40, 1200),
  );
}
