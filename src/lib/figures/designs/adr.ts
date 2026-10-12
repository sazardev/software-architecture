import {
  arrowHead,
  circle,
  figure,
  group,
  label,
  line,
  motion,
  path,
  pulse,
  rect,
} from '../figure-kit';
import type { Paint, Tone, Figure } from '../figure-types';

type Record = Readonly<{
  card: Paint;
  id: string;
  status: string;
  tone: Tone;
  x: number;
}>;

const TOP = 62;
const CARD_W = 116;
const CARD_H = 158;
const TIMELINE = 268;

const records: readonly Record[] = [
  { card: { fill: 'paper' }, id: 'ADR-001', status: 'ACCEPTED', tone: 'ink', x: 36 },
  {
    card: { fill: 'sunken', opacity: 0.85 },
    id: 'ADR-002',
    status: 'SUPERSEDED',
    tone: 'muted',
    x: 184,
  },
  { card: { fill: 'accentSoft' }, id: 'ADR-003', status: 'ACCEPTED', tone: 'accent', x: 332 },
  {
    card: { dash: '5 4', fill: 'paper' },
    id: 'ADR-004',
    status: 'PROPOSED',
    tone: 'brand',
    x: 480,
  },
];

const textLines = [0.82, 0.64, 0.74, 0.46];

function recordCard(record: Record, index: number) {
  const center = record.x + CARD_W / 2;

  return group(
    [
      rect(record.x, TOP, CARD_W, CARD_H, { ...record.card, r: 4, width: 1.6 }),
      label(record.x + 12, TOP + 24, record.id, { anchor: 'start', size: 11, tone: 'ink' }),
      line(record.x + 12, TOP + 38, record.x + CARD_W - 12, TOP + 38, { width: 1 }),
      ...textLines.map((fraction, row) =>
        line(
          record.x + 12,
          TOP + 60 + row * 16,
          record.x + 12 + (CARD_W - 24) * fraction,
          TOP + 60 + row * 16,
          {
            stroke: 'faint',
            width: 3,
          },
        ),
      ),
      label(center, TOP + CARD_H - 14, record.status, {
        size: 10,
        tone: record.tone,
        tracking: 1.2,
      }),
      line(center, TOP + CARD_H, center, TIMELINE, { dash: '2 4', stroke: 'muted', width: 1 }),
      circle(center, TIMELINE, 6, {
        fill: record.tone === 'accent' ? 'accent' : 'paper',
        width: 1.7,
      }),
    ],
    motion('rise', index * 150),
  );
}

export function adr(): Figure {
  const from = 332 + CARD_W / 2;
  const to = 184 + CARD_W / 2;

  return figure(
    line(20, TIMELINE, 620, TIMELINE, { width: 1.5 }),
    records.map((record, index) => recordCard(record, index)),
    // La decisión nueva reemplaza a la anterior sin borrarla: el historial se conserva.
    group(
      [
        path(`M${from} ${TIMELINE + 12}C${from} 332 ${to} 332 ${to} ${TIMELINE + 14}`, {
          dash: '4 4',
          stroke: 'accent',
          width: 1.8,
        }),
        arrowHead([to, 320], [to, TIMELINE + 12], 'accent'),
        label((from + to) / 2, 350, 'SUPERSEDES', { tone: 'accent' }),
      ],
      motion('fade', 900),
    ),
    pulse(from, TIMELINE, 14, 1000),
  );
}
