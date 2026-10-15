import {
  arrow,
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
import type { Figure, FigureLocale, GroupPrim } from '../figure-types';

const CHAIN_Y = 200;
const LINK_CENTER_Y = 150;
const GATE_X = 508;

const COPY = {
  en: {
    title: 'SUPPLY CHAIN',
    footer: 'A SEAL AT EVERY LINK · CHECK BEFORE DEPLOY',
    gate: 'VERIFY',
    deploy: 'DEPLOY',
    links: ['CODE', 'DEPENDENCIES', 'BUILD', 'ARTIFACT'],
  },
  es: {
    title: 'CADENA DE SUMINISTRO',
    footer: 'UN SELLO EN CADA ESLABÓN · COMPROBACIÓN ANTES DEL DESPLIEGUE',
    gate: 'VERIFICAR',
    deploy: 'DESPLIEGUE',
    links: ['CÓDIGO', 'DEPENDENCIAS', 'BUILD', 'ARTEFACTO'],
  },
} as const;

/**
Posición horizontal del eslabón `index` (cuatro eslabones separados 108 unidades).
*/
const nodeX = (index: number): number => 84 + index * 108;

/**
Eslabón: nodo de la cadena, su sello de firma encima y su rótulo debajo.
*/
function link(name: string, x: number, index: number): GroupPrim {
  return group(
    [
      line(x, LINK_CENTER_Y + 12, x, CHAIN_Y - 24, { dash: '2 3', stroke: 'faint', width: 1 }),
      circle(x, LINK_CENTER_Y, 11, { fill: 'brandSoft', stroke: 'brand', width: 1.4 }),
      path(`M${x - 4.5} ${LINK_CENTER_Y}l3 3.2l5.5-6.2`, { stroke: 'brand', width: 1.8 }),
      circle(x, CHAIN_Y, 24, { fill: 'paper', width: 1.6 }),
      label(x, CHAIN_Y + 50, name, { size: 10, tone: 'ink' }),
    ],
    motion('rise', 150 + index * 120),
  );
}

/**
Tramo de la cadena entre dos puntos de la cadena, con cabeza de flecha.
*/
function bridge(from: number, to: number): GroupPrim {
  return arrow(
    [
      [from, CHAIN_Y],
      [to, CHAIN_Y],
    ],
    { tone: 'muted' },
  );
}

/**
Los tres tramos entre eslabones y el último hacia la puerta (x: 84, 192, 300, 408 y 508).
*/
function chainBridges(): GroupPrim {
  return group(
    [bridge(114, 162), bridge(222, 270), bridge(330, 378), bridge(438, 482)],
    motion('fade', 600),
  );
}

/**
Puerta de verificación: la idea clave, con el único acento del plano.
*/
function gate(verifyLabel: string): GroupPrim {
  return group(
    [
      rect(GATE_X - 22, CHAIN_Y - 50, 44, 100, {
        fill: 'accentSoft',
        r: 4,
        stroke: 'accent',
        width: 1.8,
      }),
      circle(GATE_X, CHAIN_Y - 16, 10, { fill: 'paper', stroke: 'accent', width: 1.6 }),
      path(`M${GATE_X - 4} ${CHAIN_Y - 16}l2.8 3l5-5.6`, { stroke: 'accent', width: 1.8 }),
      line(GATE_X - 12, CHAIN_Y + 14, GATE_X + 12, CHAIN_Y + 14, { stroke: 'accent', width: 1 }),
      line(GATE_X - 12, CHAIN_Y + 24, GATE_X + 6, CHAIN_Y + 24, { stroke: 'accent', width: 1 }),
      label(GATE_X, CHAIN_Y + 70, verifyLabel, { size: 10, tone: 'accent' }),
    ],
    motion('rise', 700),
  );
}

export function cadenaDeSuministroSoftware(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    label(44, 84, copy.title, { anchor: 'start', size: 11.5, tone: 'ink', tracking: 3 }),
    line(44 + copy.title.length * 13, 80, 596, 80, { dash: '2 4', stroke: 'muted', width: 1 }),
    copy.links.map((name, index) => link(name, nodeX(index), index)),
    chainBridges(),
    gate(copy.gate),
    // Salida: lo verificado llega al despliegue.
    group(
      [
        arrow(
          [
            [GATE_X + 26, CHAIN_Y],
            [572, CHAIN_Y],
          ],
          { flow: true, tone: 'accent', width: 2 },
        ),
        circle(592, CHAIN_Y, 14, { fill: 'accent', width: 1.8 }),
        label(592, CHAIN_Y + 34, copy.deploy, { size: 10, tone: 'ink' }),
      ],
      motion('fade', 1000),
    ),
    pulse(592, CHAIN_Y, 22, 1200),
    label(320, 344, copy.footer, { size: 10.5, tone: 'muted' }),
  );
}
