import type { CSSProperties } from 'react';

import type { Motion, Paint, Prim, TextPrim } from '@/lib/figures/figure-types';
import { cn } from '@/lib/utils/cn';

import { fillClass, fontClass, strokeClass, textClass } from './figure-classes';

const motionClass = {
  draw: 'animate-draw',
  fade: 'animate-fade',
  float: 'animate-float',
  flow: 'animate-flow',
  pulse: 'animate-pulse-ring',
  rise: 'animate-rise',
} as const;

function motionStyle(motion: Motion | undefined): CSSProperties | undefined {
  if (motion === undefined) {
    return undefined;
  }

  const style: CSSProperties = { animationDelay: `${motion.delay ?? 0}ms` };

  // El anillo de pulso escala desde su propio centro.
  return motion.kind === 'pulse'
    ? { ...style, transformBox: 'fill-box', transformOrigin: 'center' }
    : style;
}

function paintProps(paint: Paint) {
  const isAnimated = paint.motion?.kind === 'pulse';

  return {
    className: cn(
      paint.fill === undefined ? 'fill-none' : fillClass[paint.fill],
      paint.stroke === undefined ? 'stroke-none' : strokeClass[paint.stroke],
      paint.motion !== undefined && motionClass[paint.motion.kind],
    ),
    opacity: isAnimated ? undefined : paint.opacity,
    strokeDasharray: paint.motion?.kind === 'draw' ? 1 : paint.dash,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: paint.stroke === undefined ? undefined : (paint.width ?? 1.5),
    style: motionStyle(paint.motion),
  };
}

function Text({ prim }: Readonly<{ prim: TextPrim }>) {
  return (
    <text
      className={cn(
        fontClass[prim.font ?? 'mono'],
        textClass[prim.tone ?? 'ink'],
        prim.motion !== undefined && motionClass[prim.motion.kind],
      )}
      fontSize={prim.size ?? 12}
      fontStyle={prim.italic === true ? 'italic' : undefined}
      letterSpacing={prim.tracking}
      style={motionStyle(prim.motion)}
      textAnchor={prim.anchor ?? 'start'}
      transform={
        prim.rotate === undefined ? undefined : `rotate(${prim.rotate} ${prim.x} ${prim.y})`
      }
      x={prim.x}
      y={prim.y}
    >
      {prim.text}
    </text>
  );
}

function Shape({ prim }: Readonly<{ prim: Prim }>) {
  switch (prim.kind) {
    case 'circle': {
      return <circle cx={prim.cx} cy={prim.cy} r={prim.r} {...paintProps(prim)} />;
    }
    case 'group': {
      return (
        <g
          className={prim.motion === undefined ? undefined : motionClass[prim.motion.kind]}
          style={motionStyle(prim.motion)}
        >
          <FigureShapes items={prim.items} />
        </g>
      );
    }
    case 'path': {
      return (
        <path
          d={prim.d}
          pathLength={prim.motion?.kind === 'draw' ? 1 : undefined}
          {...paintProps(prim)}
        />
      );
    }
    case 'rect': {
      return (
        <rect
          height={prim.h}
          rx={prim.r}
          width={prim.w}
          x={prim.x}
          y={prim.y}
          {...paintProps(prim)}
        />
      );
    }
    case 'text': {
      return <Text prim={prim} />;
    }
  }
}

type FigureShapesProps = Readonly<{ items: readonly Prim[] }>;

/**
Pinta las primitivas de una figura como elementos SVG con tokens del tema (claro/oscuro).
*/
export function FigureShapes({ items }: FigureShapesProps) {
  // La lista es estática y nunca se reordena: la posición identifica cada primitiva.
  const entries = items.map((prim, position) => ({ id: position, prim }));

  return (
    <>
      {entries.map((entry) => (
        <Shape key={entry.id} prim={entry.prim} />
      ))}
    </>
  );
}
