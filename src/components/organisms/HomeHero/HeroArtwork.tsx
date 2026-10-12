import { cn } from '@/lib/utils/cn';

const CX = 250;
const HALF_W = 160;
const HALF_H = 70;
const DEPTH = 16;

type Layer = Readonly<{
  cy: number;
  delay: number;
  label: string;
  side: string;
  stroke: string;
  top: string;
}>;

const layers: Layer[] = [
  {
    cy: 400,
    delay: 0,
    label: 'DATA',
    side: 'fill-neutral-300 dark:fill-neutral-700',
    stroke: 'stroke-neutral-900 dark:stroke-neutral-200',
    top: 'fill-neutral-100 dark:fill-neutral-800',
  },
  {
    cy: 250,
    delay: 180,
    label: 'DOMAIN',
    side: 'fill-accent-300 dark:fill-accent-800',
    stroke: 'stroke-neutral-900 dark:stroke-neutral-200',
    top: 'fill-accent-100 dark:fill-accent-900',
  },
  {
    cy: 100,
    delay: 360,
    label: 'UI',
    side: 'fill-brand-300 dark:fill-brand-800',
    stroke: 'stroke-neutral-900 dark:stroke-neutral-200',
    top: 'fill-brand-100 dark:fill-brand-900',
  },
];

const nodes = [
  { dx: -64, dy: 6 },
  { dx: 20, dy: -14 },
  { dx: 72, dy: 12 },
] as const;

function diamond(cy: number, scale = 1): string {
  const w = HALF_W * scale;
  const h = HALF_H * scale;

  return `M${CX} ${cy - h}L${CX + w} ${cy}L${CX} ${cy + h}L${CX - w} ${cy}Z`;
}

function Slab({ layer }: Readonly<{ layer: Layer }>) {
  const { cy } = layer;

  return (
    <g
      className="animate-rise"
      style={{ animationDelay: `${layer.delay + 300}ms`, transformOrigin: `${CX}px ${cy}px` }}
    >
      <path
        className={cn(layer.side, layer.stroke)}
        d={`M${CX - HALF_W} ${cy}L${CX} ${cy + HALF_H}L${CX + HALF_W} ${cy}L${CX + HALF_W} ${cy + DEPTH}L${CX} ${cy + HALF_H + DEPTH}L${CX - HALF_W} ${cy + DEPTH}Z`}
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      <path
        className={cn(layer.top, layer.stroke)}
        d={diamond(cy)}
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      <path
        className="animate-draw stroke-neutral-900/40 dark:stroke-neutral-100/40"
        d={diamond(cy, 0.62)}
        fill="none"
        pathLength={1}
        strokeDasharray="0.02 0.018"
        strokeWidth="1"
        style={{ animationDelay: `${layer.delay + 900}ms` }}
      />
    </g>
  );
}

function LayerNodes({ layer }: Readonly<{ layer: Layer }>) {
  return (
    <g className="animate-fade" style={{ animationDelay: `${layer.delay + 1100}ms` }}>
      {nodes.map((node, index) => (
        <circle
          className={cn(
            'stroke-neutral-900 dark:stroke-neutral-100',
            index === 1
              ? 'fill-accent-500 dark:fill-accent-400'
              : 'fill-neutral-50 dark:fill-neutral-950',
          )}
          cx={CX + node.dx}
          cy={layer.cy + node.dy}
          key={node.dx}
          r={index === 1 ? 6 : 4.5}
          strokeWidth="1.4"
        />
      ))}
      <path
        className="stroke-neutral-900/50 dark:stroke-neutral-100/50"
        d={`M${CX + nodes[0].dx} ${layer.cy + nodes[0].dy}L${CX + nodes[1].dx} ${layer.cy + nodes[1].dy}L${CX + nodes[2].dx} ${layer.cy + nodes[2].dy}`}
        fill="none"
        strokeWidth="1"
      />
    </g>
  );
}

function Flow({ from, to }: Readonly<{ from: number; to: number }>) {
  const x = CX + nodes[1].dx;

  return (
    <path
      className="animate-flow stroke-accent-600 dark:stroke-accent-400"
      d={`M${x} ${from + nodes[1].dy}L${x} ${to + nodes[1].dy}`}
      fill="none"
      strokeDasharray="5 7"
      strokeLinecap="round"
      strokeWidth="1.8"
    />
  );
}

function Label({ layer }: Readonly<{ layer: Layer }>) {
  return (
    <g className="animate-fade" style={{ animationDelay: `${layer.delay + 1300}ms` }}>
      <path
        className="stroke-neutral-400 dark:stroke-neutral-600"
        d={`M${CX + HALF_W + 8} ${layer.cy + 6}H${CX + HALF_W + 52}`}
        strokeDasharray="2 4"
        strokeLinecap="round"
      />
      <text
        className="fill-neutral-500 font-mono text-[11px] tracking-[0.2em] dark:fill-neutral-400"
        x={CX + HALF_W + 60}
        y={layer.cy + 10}
      >
        {layer.label}
      </text>
    </g>
  );
}

/**
Ilustración decorativa: capas isométricas con dependencias fluyendo hacia el dominio.
*/
export function HeroArtwork({ label }: Readonly<{ label: string }>) {
  const [data, domain, ui] = layers;

  if (data === undefined || domain === undefined || ui === undefined) {
    return null;
  }

  return (
    <svg
      aria-label={label}
      className="h-auto w-full overflow-visible"
      role="img"
      viewBox="0 0 640 520"
    >
      <g className="animate-float">
        <ellipse
          className="fill-neutral-900/8 dark:fill-black/30"
          cx={CX}
          cy="498"
          rx="150"
          ry="16"
        />
        <Slab layer={data} />
        <LayerNodes layer={data} />
        <Flow from={domain.cy} to={data.cy} />
        <Slab layer={domain} />
        <LayerNodes layer={domain} />
        <Flow from={ui.cy} to={domain.cy} />
        <Slab layer={ui} />
        <LayerNodes layer={ui} />
        <circle
          className="origin-center animate-pulse-ring fill-accent-500/40"
          cx={CX + nodes[1].dx}
          cy={domain.cy + nodes[1].dy}
          r="14"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        {layers.map((layer) => (
          <Label key={layer.label} layer={layer} />
        ))}
      </g>
    </svg>
  );
}
