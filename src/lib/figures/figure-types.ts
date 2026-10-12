/**
Lienzo común de todas las figuras: 640×400 unidades. Cada artículo dibuja la suya en este plano
y los renderizadores (React en pantalla, cadena SVG en las tarjetas sociales) la pintan igual.
*/
export const FIGURE_WIDTH = 640;
export const FIGURE_HEIGHT = 400;

/**
Vocabulario de color semántico. En pantalla se traduce a tokens del tema (con variante `dark:`);
en la tarjeta social, a la paleta de papel y tinta.
*/
export type Tone =
  | 'accent'
  | 'accentMid'
  | 'accentSoft'
  | 'brand'
  | 'brandMid'
  | 'brandSoft'
  | 'faint'
  | 'ink'
  | 'muted'
  | 'paper'
  | 'sunken';

export type MotionKind = 'draw' | 'fade' | 'float' | 'flow' | 'pulse' | 'rise';

export type Motion = Readonly<{
  /**
  Retardo de entrada en milisegundos.
  */
  delay?: number | undefined;
  kind: MotionKind;
}>;

export type Paint = Readonly<{
  /**
  Patrón de guiones (`"3 5"`).
  */
  dash?: string | undefined;
  fill?: Tone | undefined;
  motion?: Motion | undefined;
  opacity?: number | undefined;
  stroke?: Tone | undefined;
  width?: number | undefined;
}>;

export type PathPrim = Paint & Readonly<{ d: string; kind: 'path' }>;

export type RectPrim = Paint &
  Readonly<{ h: number; kind: 'rect'; r?: number | undefined; w: number; x: number; y: number }>;

export type CirclePrim = Paint & Readonly<{ cx: number; cy: number; kind: 'circle'; r: number }>;

export type TextFont = 'display' | 'mono' | 'sans';

export type TextPrim = Readonly<{
  anchor?: 'end' | 'middle' | 'start' | undefined;
  font?: TextFont | undefined;
  italic?: boolean | undefined;
  kind: 'text';
  motion?: Motion | undefined;
  /**
  Giro en grados alrededor del punto (x, y).
  */
  rotate?: number | undefined;
  size?: number | undefined;
  text: string;
  tone?: Tone | undefined;
  tracking?: number | undefined;
  x: number;
  y: number;
}>;

export type GroupPrim = Readonly<{
  items: readonly Prim[];
  kind: 'group';
  motion?: Motion | undefined;
}>;

export type Prim = CirclePrim | GroupPrim | PathPrim | RectPrim | TextPrim;

/**
Una figura es una lista de primitivas ordenadas de atrás hacia delante.
*/
export type Figure = readonly Prim[];

export type FigureBuilder = () => Figure;
