import { cn } from '@/lib/utils/cn';

type BoxProps = Readonly<{
  body: string;
  className?: string;
  h: number;
  title: string;
  w: number;
  x: number;
  y: number;
}>;

const lineTone = 'stroke-white/70';

/**
Caja de nodo del plano: título y descripción en mono; `className` ajusta el relleno/borde.
*/
export function Box({ body, className, h, title, w, x, y }: BoxProps) {
  return (
    <g>
      <rect
        className={cn('fill-white/5 stroke-white/40', className)}
        height={h}
        rx="3"
        strokeWidth="1.3"
        width={w}
        x={x}
        y={y}
      />
      <text
        className="fill-white font-display text-[15px] font-medium"
        textAnchor="middle"
        x={x + w / 2}
        y={y + h / 2 - 3}
      >
        {title}
      </text>
      <text
        className="fill-neutral-300 font-mono text-[10.5px] tracking-[0.04em]"
        textAnchor="middle"
        x={x + w / 2}
        y={y + h / 2 + 14}
      >
        {body}
      </text>
    </g>
  );
}

type DecisionProps = Readonly<{
  cx: number;
  cy: number;
  halfH: number;
  halfW: number;
  question: string;
  title: string;
}>;

export function Decision({ cx, cy, halfH, halfW, question, title }: DecisionProps) {
  return (
    <g>
      <path
        className="fill-accent-300/10 stroke-accent-300"
        d={`M${cx} ${cy - halfH}L${cx + halfW} ${cy}L${cx} ${cy + halfH}L${cx - halfW} ${cy}Z`}
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <text
        className="fill-accent-300 font-mono text-[10px] tracking-[0.18em]"
        textAnchor="middle"
        x={cx}
        y={cy - 7}
      >
        {title}
      </text>
      <text className="fill-white font-sans text-[13px]" textAnchor="middle" x={cx} y={cy + 12}>
        {question}
      </text>
    </g>
  );
}

type EdgeProps = Readonly<{
  accent?: boolean;
  arrow?: boolean;
  d: string;
  dashed?: boolean;
  flow?: boolean;
}>;

/**
Conector del plano; `flow` superpone un trazo animado para marcar el camino principal.
*/
export function Edge({ accent = false, arrow = true, d, dashed = false, flow = false }: EdgeProps) {
  const marker = accent ? 'cta-arrow-accent' : 'cta-arrow';

  return (
    <>
      <path
        className={accent ? 'stroke-accent-300' : lineTone}
        d={d}
        fill="none"
        markerEnd={arrow ? `url(#${marker})` : undefined}
        strokeDasharray={dashed ? '3 5' : undefined}
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      {flow ? (
        <path
          className="animate-flow stroke-accent-300"
          d={d}
          fill="none"
          strokeDasharray="5 7"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      ) : null}
    </>
  );
}

type TagProps = Readonly<{
  accent?: boolean;
  anchor?: 'end' | 'middle' | 'start';
  text: string;
  x: number;
  y: number;
}>;

export function Tag({ accent = false, anchor = 'start', text, x, y }: TagProps) {
  return (
    <text
      className={cn(
        'font-mono text-[10.5px] tracking-[0.08em]',
        accent ? 'fill-accent-300' : 'fill-neutral-300',
      )}
      textAnchor={anchor}
      x={x}
      y={y}
    >
      {text}
    </text>
  );
}

export function ArrowDefs() {
  return (
    <defs>
      <marker id="cta-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
        <path className="fill-white/80" d="M0 0L8 4L0 8Z" />
      </marker>
      <marker
        id="cta-arrow-accent"
        markerHeight="8"
        markerWidth="8"
        orient="auto"
        refX="7"
        refY="4"
      >
        <path className="fill-accent-300" d="M0 0L8 4L0 8Z" />
      </marker>
    </defs>
  );
}
