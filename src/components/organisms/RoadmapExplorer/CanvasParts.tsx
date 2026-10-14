import type { CSSProperties, KeyboardEvent } from 'react';

import {
  ROADMAP_LAYOUT,
  wrapLabel,
  type LayoutNode,
  type LayoutSegment,
  type LayoutStage,
} from '@/lib/roadmap/roadmap-layout';
import { cn } from '@/lib/utils/cn';
import { padNumber } from '@/lib/utils/pad-number';

export type StepState = 'done' | 'next' | 'pending';

const LINE_HEIGHT = 19;
const META_GAP = 17;
const STAGE_LABEL_CHARS = 19;
const HEADER_INSET = 22;

function registrationMark(x: number, y: number) {
  return <path d={`M${x - 7} ${y}h14M${x} ${y - 7}v14`} key={`${x}-${y}`} />;
}

type StageFrameProps = Readonly<{
  delay: number;
  done: number;
  frame: LayoutStage;
  label: string;
  meta: string;
  number: number;
  title: string;
  total: number;
}>;

/**
Hoja de una etapa: cabecera con numeral grande, título y avance; cuerpo con la retícula a la
vista. Marcas de registro en las esquinas y una cota sobre el ancho de la hoja.
*/
export function StageFrame({
  delay,
  done,
  frame,
  label,
  meta,
  number,
  title,
  total,
}: StageFrameProps) {
  const { height, width, x, y } = frame;
  const right = x + width;
  const header = ROADMAP_LAYOUT.headerHeight;
  const titleLines = wrapLabel(title, STAGE_LABEL_CHARS, 2);
  const progressWidth = total === 0 ? 0 : (width * done) / total;

  return (
    <g className="animate-fade" style={{ animationDelay: `${delay}ms` }}>
      <rect
        className="fill-neutral-50/80 stroke-neutral-300 dark:fill-neutral-950/80 dark:stroke-neutral-700"
        height={height}
        width={width}
        x={x}
        y={y}
      />
      <rect
        className="fill-neutral-100 dark:fill-neutral-900"
        height={header}
        width={width}
        x={x}
        y={y}
      />
      <g className="stroke-neutral-400 dark:stroke-neutral-500" fill="none" strokeWidth={1}>
        {[registrationMark(x, y), registrationMark(right, y)]}
        {[registrationMark(x, y + height), registrationMark(right, y + height)]}
        <path d={`M${x} ${y - 22}v10M${right} ${y - 22}v10M${x} ${y - 17}H${right}`} />
      </g>
      <text
        className="fill-neutral-300 font-display text-[54px] font-medium tracking-tight dark:fill-neutral-700"
        textAnchor="end"
        x={right - HEADER_INSET}
        y={y + 60}
      >
        {padNumber(number)}
      </text>
      <text
        className="fill-accent-700 font-mono text-[11px] font-semibold tracking-[0.2em] uppercase dark:fill-accent-400"
        x={x + HEADER_INSET}
        y={y + 32}
      >
        {label}
      </text>
      <text
        className="fill-neutral-950 font-display text-[21px] font-medium tracking-tight dark:fill-neutral-50"
        x={x + HEADER_INSET}
        y={y + 60}
      >
        {titleLines.map((line, index) => (
          <tspan dy={index === 0 ? 0 : 25} key={line} x={x + HEADER_INSET}>
            {line}
          </tspan>
        ))}
      </text>
      <text
        className="fill-neutral-500 font-mono text-[11px] tracking-[0.14em] uppercase dark:fill-neutral-400"
        x={x + HEADER_INSET}
        y={y + header - 18}
      >
        {meta}
      </text>
      <path
        className="stroke-neutral-300 dark:stroke-neutral-700"
        d={`M${x} ${y + header}H${right}`}
      />
      <rect
        className="fill-accent-600 transition-[width] duration-700 dark:fill-accent-400"
        height={3}
        width={progressWidth}
        x={x}
        y={y + header - 1.5}
      />
    </g>
  );
}

const nodeFill: Record<StepState, string> = {
  done: 'fill-neutral-900 stroke-neutral-900 dark:fill-neutral-100 dark:stroke-neutral-100',
  next: 'fill-accent-600 stroke-accent-600 dark:fill-accent-500 dark:stroke-accent-500',
  pending: 'fill-neutral-50 stroke-neutral-500 dark:fill-neutral-950 dark:stroke-neutral-400',
};

const numberFill: Record<StepState, string> = {
  done: 'fill-neutral-50 dark:fill-neutral-950',
  next: 'fill-neutral-50',
  pending: 'fill-neutral-700 dark:fill-neutral-200',
};

const pulseStyle: CSSProperties = { transformBox: 'fill-box', transformOrigin: 'center' };

type StepNodeProps = Readonly<{
  ariaLabel: string;
  delay: number;
  isSelected: boolean;
  meta: string;
  node: LayoutNode;
  onSelect: (slug: string) => void;
  state: StepState;
}>;

/**
Parada del trazado: círculo numerado (hecho, siguiente o pendiente) con su rótulo, sobre una
fila que se ilumina al pasar o al seleccionarla. Es un botón: clic, Intro o Espacio abren su ficha.
*/
export function StepNode({
  ariaLabel,
  delay,
  isSelected,
  meta,
  node,
  onSelect,
  state,
}: StepNodeProps) {
  const { lines, number, slug, x, y } = node;
  const r = ROADMAP_LAYOUT.nodeRadius;
  const labelX = x + ROADMAP_LAYOUT.labelOffset;
  const blockHeight = (lines.length - 1) * LINE_HEIGHT + META_GAP;
  const firstBaseline = y - blockHeight / 2 + 4;
  // El resaltado cubre solo el rótulo: la vía vertical pasa por el centro del círculo.
  const rowLeft = x + r + 7;
  const rowWidth = ROADMAP_LAYOUT.columnWidth - ROADMAP_LAYOUT.nodeOffset - r - 14;
  const rowHeight = ROADMAP_LAYOUT.rowHeight - 16;

  function onKeyDown(event: KeyboardEvent<SVGGElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    onSelect(slug);
  }

  return (
    <g
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      className="group/node animate-rise cursor-pointer outline-none"
      data-step={slug}
      onClick={() => {
        onSelect(slug);
      }}
      onKeyDown={onKeyDown}
      role="button"
      style={{ animationDelay: `${delay}ms` }}
      tabIndex={0}
    >
      <rect
        className={cn(
          'transition-colors duration-300',
          isSelected
            ? 'fill-brand-50 stroke-brand-300 dark:fill-brand-950/70 dark:stroke-brand-700'
            : 'fill-transparent stroke-transparent group-hover/node:fill-neutral-100 group-focus-visible/node:stroke-brand-500 dark:group-hover/node:fill-neutral-900',
        )}
        height={rowHeight}
        width={rowWidth}
        x={rowLeft}
        y={y - rowHeight / 2}
      />
      {state === 'next' ? (
        <circle
          className="animate-pulse-ring fill-accent-500/40"
          cx={x}
          cy={y}
          r={r}
          style={pulseStyle}
        />
      ) : null}
      <circle
        className={cn(
          'transition-colors duration-500',
          nodeFill[state],
          isSelected && 'stroke-brand-600 dark:stroke-brand-300',
        )}
        cx={x}
        cy={y}
        r={r}
        strokeWidth={isSelected ? 3 : 2}
      />
      <text
        className={cn('font-mono text-[12px] font-semibold', numberFill[state])}
        dominantBaseline="central"
        textAnchor="middle"
        x={x}
        y={y + 0.5}
      >
        {state === 'done' ? '✓' : padNumber(number)}
      </text>
      <text
        className={cn(
          'font-sans text-[15px] font-medium transition-colors duration-300',
          isSelected
            ? 'fill-brand-800 dark:fill-brand-200'
            : 'fill-neutral-900 group-hover/node:fill-brand-700 dark:fill-neutral-100 dark:group-hover/node:fill-brand-300',
        )}
        x={labelX}
        y={firstBaseline}
      >
        {lines.map((line, index) => (
          <tspan dy={index === 0 ? 0 : LINE_HEIGHT} key={line} x={labelX}>
            {line}
          </tspan>
        ))}
      </text>
      <text
        className="fill-neutral-500 font-mono text-[11px] tracking-[0.12em] uppercase dark:fill-neutral-400"
        x={labelX}
        y={firstBaseline + (lines.length - 1) * LINE_HEIGHT + META_GAP + 2}
      >
        {meta}
      </text>
    </g>
  );
}

type TrackProps = Readonly<{
  done: ReadonlySet<string>;
  nextSlug: string | undefined;
  segments: LayoutSegment[];
}>;

/**
Trazado de la ruta: vía base que se dibuja al entrar, tramos recorridos en tinta gruesa y el
tramo hacia el siguiente paso con flujo brasa animado.
*/
export function Track({ done, nextSlug, segments }: TrackProps) {
  const fullPath = segments.map((segment) => segment.d).join('');

  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path
        className="animate-draw stroke-neutral-400 dark:stroke-neutral-600"
        d={fullPath}
        pathLength={1}
        strokeDasharray="1"
        strokeWidth={2}
      />
      {segments.map((segment) => {
        const isWalked = done.has(segment.from) && done.has(segment.to);
        const isActive = done.has(segment.from) && segment.to === nextSlug;

        if (isWalked) {
          return (
            <path
              className="animate-fade stroke-neutral-900 dark:stroke-neutral-100"
              d={segment.d}
              key={segment.to}
              strokeWidth={4}
            />
          );
        }

        return isActive ? (
          <path
            className="animate-flow stroke-accent-600 dark:stroke-accent-400"
            d={segment.d}
            key={segment.to}
            strokeDasharray="5 7"
            strokeWidth={3}
          />
        ) : null;
      })}
    </g>
  );
}
