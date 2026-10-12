import { group, motion, path, poly, type Point } from './figure-kit';
import type { GroupPrim, Motion, Paint, PathPrim, Tone } from './figure-types';

/**
Vértices de un polígono regular; `rotation` en grados (0 = primer vértice a la derecha).
*/
export function regularPolygon(
  cx: number,
  cy: number,
  radius: number,
  sides: number,
  rotation = 0,
): Point[] {
  return Array.from({ length: sides }, (_, index) => {
    const angle = ((rotation + (360 / sides) * index) * Math.PI) / 180;

    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)] as const;
  });
}

type SlabTones = Readonly<{ side: Tone; top: Tone }>;

/**
Losa isométrica (el lenguaje de la portada): cara superior en rombo y laterales con grosor.
`cx`/`cy` es el centro del rombo; `hw`/`hh` su semiancho y semialto.
*/
export function slab(
  cx: number,
  cy: number,
  hw: number,
  hh: number,
  depth: number,
  tones: SlabTones,
  withMotion?: Motion,
): GroupPrim {
  const sides: PathPrim = path(
    `M${cx - hw} ${cy}L${cx} ${cy + hh}L${cx + hw} ${cy}L${cx + hw} ${cy + depth}L${cx} ${cy + hh + depth}L${cx - hw} ${cy + depth}Z`,
    { fill: tones.side },
  );
  const top = poly(
    [
      [cx, cy - hh],
      [cx + hw, cy],
      [cx, cy + hh],
      [cx - hw, cy],
    ],
    { fill: tones.top },
    true,
  );

  return group([sides, top], withMotion ?? motion('rise'));
}

/**
Cubo isométrico: tres caras (superior, izquierda, derecha). `cx`/`cy` es el centro de la tapa.
*/
export function cube(
  cx: number,
  cy: number,
  size: number,
  tones: Readonly<{ left: Tone; right: Tone; top: Tone }>,
  withMotion?: Motion,
): GroupPrim {
  const hw = size;
  const hh = size / 2;
  const left = poly(
    [
      [cx - hw, cy],
      [cx, cy + hh],
      [cx, cy + hh + size],
      [cx - hw, cy + size],
    ],
    { fill: tones.left },
    true,
  );
  const right = poly(
    [
      [cx + hw, cy],
      [cx, cy + hh],
      [cx, cy + hh + size],
      [cx + hw, cy + size],
    ],
    { fill: tones.right },
    true,
  );
  const top = poly(
    [
      [cx, cy - hh],
      [cx + hw, cy],
      [cx, cy + hh],
      [cx - hw, cy],
    ],
    { fill: tones.top },
    true,
  );

  return group([left, right, top], withMotion ?? motion('rise'));
}

/**
Curva suave que pasa por los puntos (Catmull-Rom a Bézier cúbica).
*/
export function smoothPath(points: readonly Point[], tension = 0.5): string {
  const first = points[0];

  if (first === undefined) {
    return '';
  }

  let d = `M${first[0]} ${first[1]}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] ?? points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] ?? p2;

    if (p0 === undefined || p1 === undefined || p2 === undefined || p3 === undefined) {
      continue;
    }

    const c1x = p1[0] + ((p2[0] - p0[0]) * tension) / 3;
    const c1y = p1[1] + ((p2[1] - p0[1]) * tension) / 3;
    const c2x = p2[0] - ((p3[0] - p1[0]) * tension) / 3;
    const c2y = p2[1] - ((p3[1] - p1[1]) * tension) / 3;

    d += `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0]} ${p2[1]}`;
  }

  return d;
}

/**
Contorno orgánico cerrado (curva de nivel): círculo con ondulaciones deterministas.
*/
export function blob(cx: number, cy: number, radius: number, phase = 0, paint?: Paint): PathPrim {
  const points = Array.from({ length: 72 }, (_, index): Point => {
    const angle = (index / 72) * Math.PI * 2;
    const wobble = 1 + 0.1 * Math.sin(3 * angle + phase) + 0.06 * Math.sin(5 * angle + phase * 2);

    return [cx + radius * wobble * Math.cos(angle), cy + radius * 0.82 * wobble * Math.sin(angle)];
  });

  return poly(points, paint ?? { stroke: 'faint', width: 1.1 }, true);
}
