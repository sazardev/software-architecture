import { arrow, figure, group, heading, label, line, motion, node, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const LEFT_X = 40;
const RIGHT_X = 340;
const PANEL_Y = 84;
const PANEL_H = 262;
const PANEL_W = 260;
const BOX_W = 220;
const BOX_H = 44;
const BOX_LEFT = 60;
const BOX_RIGHT = 360;
const BUS_X = 322;

const COPY = {
  en: {
    bottom: 'the lag needs an owner and a metric',
    copyNote: 'the copy is paid on write',
    copies: [
      { fields: 'name · email · total', name: 'ORDERS' },
      { fields: 'name · email · total', name: 'INVOICES' },
      { fields: 'name · email · total', name: 'SUPPORT' },
    ],
    denormalized: 'DENORMALIZED',
    entities: [
      { fields: 'id · name · email', name: 'CUSTOMER' },
      { fields: 'id · customer_id · date', name: 'ORDER' },
      { fields: 'order_id · product_id · qty', name: 'LINE' },
    ],
    normalized: 'NORMALIZED',
    oneFact: 'one fact, one place',
    title: 'One fact, two ways to store it',
    cardinality: '1 : N',
  },
  es: {
    bottom: 'el desfase necesita dueño y medida',
    copyNote: 'la copia se paga al escribir',
    copies: [
      { fields: 'nombre · email · total', name: 'PEDIDOS' },
      { fields: 'nombre · email · total', name: 'FACTURAS' },
      { fields: 'nombre · email · total', name: 'SOPORTE' },
    ],
    denormalized: 'DESNORMALIZADO',
    entities: [
      { fields: 'id · nombre · email', name: 'CLIENTE' },
      { fields: 'id · cliente_id · fecha', name: 'PEDIDO' },
      { fields: 'pedido_id · producto_id · cant.', name: 'LÍNEA' },
    ],
    normalized: 'NORMALIZADO',
    oneFact: 'un hecho, un sitio',
    title: 'Un hecho, dos formas de guardarlo',
    cardinality: '1 : N',
  },
} as const;

const entityTop = (index: number): number => 118 + index * 72;
const entityMid = (index: number): number => entityTop(index) + BOX_H / 2;
const copyTop = (index: number): number => 122 + index * 72;

/**
Una misma entidad, normalizada (piezas unidas por claves) o copiada en cada lectura. La copia
evita joins, pero cada copia necesita un dueño y un mecanismo que la mantenga al día.
*/
export function modeladoDeDatosNormalizacion(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];
  return figure(
    heading(320, 60, copy.title, { size: 14 }),
    rect(LEFT_X, PANEL_Y, PANEL_W, PANEL_H, { fill: 'sunken', r: 6, stroke: undefined }),
    rect(RIGHT_X, PANEL_Y, PANEL_W, PANEL_H, { fill: 'sunken', r: 6, stroke: undefined }),
    label(LEFT_X + PANEL_W / 2, 104, copy.normalized, { size: 11, tone: 'ink', tracking: 2 }),
    label(RIGHT_X + PANEL_W / 2, 104, copy.denormalized, { size: 11, tone: 'ink', tracking: 2 }),

    // Lado normalizado: tres tablas unidas por claves foráneas con cardinalidad.
    copy.entities.map((entity, index) => {
      const top = entityTop(index);

      return group(
        [
          rect(BOX_LEFT, top, BOX_W, BOX_H, { fill: 'paper', r: 6, width: 1.5 }),
          label(BOX_LEFT + 12, top + 18, entity.name, {
            anchor: 'start',
            size: 11,
            tone: 'ink',
            tracking: 1.2,
          }),
          label(BOX_LEFT + 12, top + 34, entity.fields, {
            anchor: 'start',
            size: 10.5,
            tracking: 0,
          }),
        ],
        motion('rise', 200 + index * 120),
      );
    }),
    [0, 1].map((index) =>
      group(
        [
          line(170, entityMid(index) + BOX_H / 2, 170, entityMid(index + 1) - BOX_H / 2, {
            stroke: 'muted',
            width: 1.2,
          }),
          node(170, (entityMid(index) + entityMid(index + 1)) / 2, 3.5),
          label(180, (entityMid(index) + entityMid(index + 1)) / 2 + 4, copy.cardinality, {
            anchor: 'start',
            size: 10,
          }),
        ],
        motion('fade', 700),
      ),
    ),
    label(LEFT_X + PANEL_W / 2, 330, copy.oneFact, { size: 11, tone: 'muted' }),

    // Lado desnormalizado: la misma información copiada en cada vista de lectura.
    group(
      copy.copies.map((_, index) => {
        const target = copyTop(index) + BOX_H / 2;

        return arrow(
          [
            [LEFT_X + PANEL_W - 2, entityMid(0)],
            [BUS_X, entityMid(0)],
            [BUS_X, target],
            [BOX_RIGHT - 4, target],
          ],
          { flow: true, tone: 'accent', width: 1.4 },
        );
      }),
      motion('fade', 1000),
    ),
    copy.copies.map((item, index) =>
      group(
        [
          rect(BOX_RIGHT, copyTop(index), BOX_W, BOX_H, { fill: 'paper', r: 6, width: 1.5 }),
          label(BOX_RIGHT + 12, copyTop(index) + 18, item.name, {
            anchor: 'start',
            size: 11,
            tone: 'ink',
            tracking: 1.2,
          }),
          label(BOX_RIGHT + 12, copyTop(index) + 34, item.fields, {
            anchor: 'start',
            size: 10.5,
            tracking: 0,
          }),
        ],
        motion('rise', 500 + index * 120),
      ),
    ),
    label(RIGHT_X + PANEL_W / 2, 330, copy.copyNote, { size: 11, tone: 'muted' }),

    label(320, 378, copy.bottom, { size: 12, tone: 'ink' }),
  );
}
