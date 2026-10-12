import {
  arrow,
  arrowHead,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  node,
  path,
  pulse,
  rect,
  type Point,
} from '../figure-kit';
import type { Figure } from '../figure-types';

/**
Contorno de nube: base plana y cuatro arcos que abultan hacia fuera.
*/
function cloudOutline(cx: number, cy: number): string {
  return [
    `M${cx - 55} ${cy + 22}`,
    `L${cx + 55} ${cy + 22}`,
    `A22 22 0 0 0 ${cx + 50} ${cy - 18}`,
    `A30 30 0 0 0 ${cx - 5} ${cy - 30}`,
    `A25 25 0 0 0 ${cx - 48} ${cy - 8}`,
    `A16 16 0 0 0 ${cx - 55} ${cy + 22}`,
    'Z',
  ].join('');
}

function cloud(cx: number, cy: number, name: string, network: string, delay: number, size = 17) {
  return group(
    [
      path(cloudOutline(cx, cy), { fill: 'paper', width: 1.6 }),
      heading(cx, cy + 4, name, { size }),
      label(cx, cy + 18, network, { size: 9 }),
    ],
    motion('rise', delay),
  );
}

function chip(x: number, text: string) {
  return [
    rect(x, 198, 46, 26, { fill: 'paper', r: 4, width: 1.2 }),
    label(x + 23, 215, text, { size: 10.5, tone: 'ink', tracking: 1 }),
  ];
}

const aws: Point = [130, 112];
const azure: Point = [510, 112];
const google: Point = [320, 334];
const linkFrom: Point = [199, 100];
const linkTo: Point = [441, 100];

export function multinubeCuandoTieneSentido(): Figure {
  return figure(
    // Capa de plataforma común (IaC, IdP, OTel): se comparte una vez; cada nube conserva su IAM y su API.
    group(
      [
        rect(232, 180, 176, 62, { fill: 'brandSoft', r: 6, width: 1.6 }),
        ...chip(243, 'IaC'),
        ...chip(297, 'IdP'),
        ...chip(351, 'OTel'),
      ],
      motion('rise'),
    ),
    // Radios de la capa de plataforma hacia cada nube.
    group(
      [
        line(176, 136, 250, 180, { dash: '3 5', stroke: 'muted', width: 1.3 }),
        line(464, 136, 390, 180, { dash: '3 5', stroke: 'muted', width: 1.3 }),
        line(320, 242, 320, 302, { dash: '3 5', stroke: 'muted', width: 1.3 }),
      ],
      motion('fade', 500),
    ),
    cloud(aws[0], aws[1], 'AWS', 'VPC', 200),
    cloud(azure[0], azure[1], 'Azure', 'VNet', 320),
    cloud(google[0], google[1], 'Google Cloud', 'VPC', 440, 13.5),
    // Cada nube mantiene su propio plano de control: 3 × IAM y 3 × API.
    // El enlace entre nubes: el punto caro y frágil.
    group(
      [
        arrow([linkFrom, linkTo], { flow: true, tone: 'accent', width: 1.8 }),
        arrowHead(linkTo, linkFrom, 'accent'),
        node(191, 100, 3.5),
        node(449, 100, 3.5),
        label(320, 76, 'EGRESS  ·  +ms', { size: 11, tone: 'accent', tracking: 2 }),
      ],
      motion('fade', 700),
    ),
    pulse(320, 100, 16, 1000),
    label(320, 388, '3 × IAM  ·  3 × API', { size: 10, tracking: 2 }),
  );
}
