import { arrow, figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    team: 'TEAM',
    cloud: 'CLOUD',
    goldenPath: 'GOLDEN PATH',
    platform: 'PLATFORM',
    teams: 'TEAMS',
    title: 'The platform turns many requests into one path',
  },
  es: {
    team: 'EQUIPO',
    cloud: 'NUBE',
    goldenPath: 'CAMINO DORADO',
    platform: 'PLATAFORMA',
    teams: 'EQUIPOS',
    title: 'La plataforma convierte peticiones en un camino',
  },
} as const;

/**
Los equipos de producto usan un camino ya construido en lugar de montar su propia infraestructura.
La plataforma es un producto: se diseña para sus usuarios internos y se mide por lo que ahorra.
*/
export function plataformaInternaIdp(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];
  const teams = [120, 190, 260] as const;

  return figure(
    heading(320, 66, copy.title, { size: 15 }),
    group(
      [
        label(120, 108, copy.teams, { size: 10, tracking: 2, tone: 'muted' }),
        ...teams.map((y, index) =>
          group([
            rect(60, y, 120, 44, { fill: 'paper', r: 6, width: 1.4 }),
            label(120, y + 27, `${copy.team} ${index + 1}`, { size: 10 }),
          ]),
        ),
      ],
      motion('rise', 0),
    ),
    group(
      [
        rect(250, 150, 150, 120, { fill: 'accent', r: 10, stroke: undefined }),
        label(325, 200, copy.platform, { size: 11, tone: 'paper', tracking: 1.4 }),
        label(325, 230, copy.goldenPath, { size: 9.5, tone: 'paper' }),
      ],
      motion('rise', 200),
    ),
    group(
      [
        rect(470, 170, 120, 60, { fill: 'brandSoft', r: 8, width: 1.5 }),
        label(530, 206, copy.cloud, { size: 11, tracking: 1.4 }),
      ],
      motion('rise', 400),
    ),
    group(
      [
        arrow(
          [
            [184, 142],
            [246, 190],
          ],
          { tone: 'muted' },
        ),
        arrow(
          [
            [184, 212],
            [246, 212],
          ],
          { tone: 'muted' },
        ),
        arrow(
          [
            [184, 282],
            [246, 234],
          ],
          { tone: 'muted' },
        ),
        arrow(
          [
            [404, 210],
            [466, 210],
          ],
          { tone: 'ink' },
        ),
      ],
      motion('fade', 500),
    ),
  );
}
