import {
  arrow,
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
import type { Figure, FigureLocale, Prim } from '../figure-types';

const PATH_Y = 170;
const GATE_X = 420;
const OUTCOME_X = 530;

const COPY = {
  en: {
    gate: 'GATE',
    judge: 'JUDGE',
    outcome: ['FINAL', 'STATE'],
    rubric: 'rubric + criteria',
    steps: ['PLAN', 'SEARCH', 'EDIT'],
    title: 'Trajectory under evaluation',
    trace: 'TRACE: steps, tools, decisions',
    note: 'the judge scores the trace and the outcome, not only the answer',
  },
  es: {
    gate: 'COMPUERTA',
    judge: 'JUEZ',
    outcome: ['ESTADO', 'FINAL'],
    rubric: 'rúbrica + criterios',
    steps: ['PLAN', 'BUSCA', 'EDITA'],
    title: 'Trayectoria bajo evaluación',
    trace: 'TRAZA: pasos, herramientas, decisiones',
    note: 'el juez puntúa la traza y el resultado, no solo la respuesta',
  },
} as const;

const STEP_XS = [90, 200, 310] as const;

function stepNode(x: number, index: number, name: string): Prim {
  return group(
    [
      node(x, PATH_Y, 7),
      label(x, PATH_Y - 22, String(index + 1), { size: 10, tone: 'muted' }),
      label(x, PATH_Y + 30, name, { size: 10, tone: 'ink' }),
    ],
    motion('rise', index * 150),
  );
}

function outcomeBox(first: string, second: string): Prim {
  return group(
    [
      rect(OUTCOME_X - 36, PATH_Y - 26, 72, 52, { fill: 'paper', r: 6 }),
      label(OUTCOME_X, PATH_Y - 2, first, { size: 10, tone: 'ink', tracking: 0.8 }),
      label(OUTCOME_X, PATH_Y + 14, second, { size: 10, tone: 'ink', tracking: 0.8 }),
    ],
    motion('rise', 600),
  );
}

function judgeBox(judge: string, rubric: string): Prim {
  return group(
    [
      arrow(
        [
          [310, 262],
          [310, 286],
        ],
        { dash: '4 4', tone: 'muted', width: 1 },
      ),
      rect(220, 290, 180, 62, { fill: 'brandSoft', r: 8 }),
      label(310, 316, judge, { size: 12, tone: 'ink', tracking: 1.4 }),
      label(310, 336, rubric, { size: 10, tone: 'muted' }),
    ],
    motion('rise', 900),
  );
}

/**
Una trayectoria recorre pasos y herramientas hasta un estado final. La compuerta verifica el
resultado con criterios comprobables; el juez puntúa la traza completa, no solo la respuesta.
*/
export function evaluarAgentesTrayectorias(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];
  const [first, second, third] = copy.steps;
  const [outcomeFirst, outcomeSecond] = copy.outcome;
  const steps = [
    { name: first, x: STEP_XS[0] },
    { name: second, x: STEP_XS[1] },
    { name: third, x: STEP_XS[2] },
  ];

  return figure(
    heading(320, 60, copy.title, { size: 15 }),
    group(
      [
        arrow([
          [STEP_XS[0] + 10, PATH_Y],
          [STEP_XS[1] - 10, PATH_Y],
        ]),
        arrow([
          [STEP_XS[1] + 10, PATH_Y],
          [STEP_XS[2] - 10, PATH_Y],
        ]),
        arrow([
          [STEP_XS[2] + 10, PATH_Y],
          [GATE_X - 12, PATH_Y],
        ]),
        arrow([
          [GATE_X + 12, PATH_Y],
          [OUTCOME_X - 40, PATH_Y],
        ]),
      ],
      motion('draw', 200),
    ),
    steps.map((step, index) => stepNode(step.x, index, step.name)),
    group(
      [
        line(GATE_X, 118, GATE_X, 222, { stroke: 'accent', width: 3 }),
        label(GATE_X, 108, copy.gate, { size: 10, tone: 'accent' }),
        pulse(GATE_X, PATH_Y, 16, 0),
      ],
      motion('draw', 700),
    ),
    outcomeBox(outcomeFirst, outcomeSecond),
    group([label(310, 252, copy.trace, { size: 10, tone: 'muted' })], motion('fade', 500)),
    judgeBox(copy.judge, copy.rubric),
    label(320, 382, copy.note, { tone: 'muted', size: 10 }),
  );
}
