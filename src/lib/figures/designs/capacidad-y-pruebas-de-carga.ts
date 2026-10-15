import {
  arrowHead,
  figure,
  group,
  label,
  line,
  motion,
  node,
  poly,
  pulse,
  rect,
  type Point,
} from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

// Plano: carga como fracción de la capacidad al SLO (horizontal) y latencia p99 (vertical).
const left = 90;
const right = 570;
const base = 330;
const top = 70;
const height = base - top;

// Latencia relativa: ρ / (1 − ρ) escalado y recortado al alto del plano.
const scale = 18;
const latency = (rho: number): number => Math.min(height, (scale * rho) / (1 - rho));

const toX = (rho: number): number => left + (right - left) * rho;
const toY = (rho: number): number => base - latency(rho);

const curve: Point[] = Array.from({ length: 94 }, (_, step) => [toX(step / 100), toY(step / 100)]);

// Latencia que marca el SLO y la carga en la que la curva lo cruza.
const sloLatency = 150;
const sloRho = sloLatency / (sloLatency + scale);
const sloY = base - sloLatency;

const target = 0.6;
const peak = 0.45;

const ticks = [0, 0.25, 0.5, 0.75, 1];

type Texts = Readonly<{
  margin: string;
  peak: string;
  saturation: string;
  slo: string;
  target: string;
  xAxis: string;
  yAxis: string;
}>;

const texts: Record<FigureLocale, Texts> = {
  en: {
    margin: 'MARGIN',
    peak: 'FORECAST PEAK',
    saturation: 'SATURATION',
    slo: 'p99 SLO',
    target: 'TARGET 60%',
    xAxis: 'LOAD / CAPACITY',
    yAxis: 'p99 LATENCY',
  },
  es: {
    margin: 'MARGEN',
    peak: 'PICO PREVISTO',
    saturation: 'SATURACIÓN',
    slo: 'SLO p99',
    target: 'OBJETIVO 60%',
    xAxis: 'CARGA / CAPACIDAD',
    yAxis: 'LATENCIA p99',
  },
};

const marginBand = (t: Texts) => {
  const targetX = toX(target);
  const sloX = toX(sloRho);

  return group(
    [
      rect(targetX, top, sloX - targetX, height, {
        fill: 'sunken',
        stroke: undefined,
        width: undefined,
      }),
      label((targetX + sloX) / 2, top + 22, t.margin, { size: 11, tone: 'muted' }),
    ],
    motion('fade', 300),
  );
};

const axes = (t: Texts) => {
  const tickGroups = ticks.map((rho) =>
    group(
      [
        line(toX(rho), base, toX(rho), base + 6, { stroke: 'muted', width: 1 }),
        label(toX(rho), base + 24, `${Math.round(rho * 100)}%`, { size: 11 }),
      ],
      motion('fade', 300),
    ),
  );

  return group(
    [
      poly([[left, base], ...curve, [toX(0.93), base]], { fill: 'brandSoft', stroke: undefined }),
      line(left, base, 600, base, { width: 1.6 }),
      arrowHead([left, base], [606, base], 'ink', 8),
      line(left, base, left, top - 14, { width: 1.6 }),
      arrowHead([left, base], [left, top - 20], 'ink', 8),
      ...tickGroups,
      label(right, base + 46, t.xAxis, { anchor: 'end', size: 11, tone: 'ink' }),
      label(left + 8, top - 4, t.yAxis, { anchor: 'start', size: 11, tone: 'ink' }),
      line(right, base, right, top, { dash: '4 4', stroke: 'muted', width: 1.2 }),
      label(right, top - 4, t.saturation, { anchor: 'end', size: 11, tone: 'muted' }),
    ],
    motion('rise'),
  );
};

const sloMark = (t: Texts) => {
  const sloX = toX(sloRho);

  return group(
    [
      line(left, sloY, sloX + 8, sloY, { dash: '4 4', stroke: 'muted', width: 1.2 }),
      line(sloX, sloY, sloX, base, { dash: '2 4', stroke: 'muted', width: 1 }),
      node(sloX, sloY, 5, false, { width: 1.6 }),
      label(left + 8, sloY - 8, t.slo, { anchor: 'start', size: 11, tone: 'muted' }),
    ],
    motion('fade', 600),
  );
};

const peakMark = (t: Texts) => {
  const x = toX(peak);
  const y = toY(peak);

  return group(
    [
      line(x, y, x, base, { dash: '2 4', stroke: 'muted', width: 1 }),
      node(x, y, 5, false, { width: 1.6 }),
      label(x - 12, y - 12, t.peak, { anchor: 'end', size: 11 }),
    ],
    motion('rise', 500),
  );
};

const targetMark = (t: Texts) => {
  const x = toX(target);
  const y = toY(target);

  return group(
    [
      line(x, y, x, base, { dash: '4 4', stroke: 'accent', width: 1.2 }),
      pulse(x, y, 16, 1000),
      node(x, y, 7, true, { width: 1.6 }),
      label(x - 14, y - 34, t.target, { anchor: 'end', size: 12, tone: 'accent' }),
    ],
    motion('rise', 700),
  );
};

const curveLine = poly(curve, { motion: motion('draw', 200), stroke: 'brand', width: 2.2 });

export function capacidadYPruebasDeCarga(locale: FigureLocale = 'es'): Figure {
  const t = texts[locale];

  return figure(marginBand(t), axes(t), curveLine, sloMark(t), peakMark(t), targetMark(t));
}
