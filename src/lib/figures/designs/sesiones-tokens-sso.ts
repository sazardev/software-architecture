import { arrow, figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    browser: 'BROWSER',
    note: 'a token stays valid until it expires',
    revoke: 'REVOKING NEEDS A LIST',
    server: 'SERVER',
    session: 'SERVER SESSION',
    sessionStore: 'SESSION STORE',
    title: 'Session or token: where the state lives',
    token: 'SELF-CONTAINED TOKEN',
    verify: 'VERIFY SIGNATURE',
  },
  es: {
    browser: 'NAVEGADOR',
    note: 'el token sigue válido hasta que expira',
    revoke: 'REVOCAR REQUIERE UNA LISTA',
    server: 'SERVIDOR',
    session: 'SESIÓN EN SERVIDOR',
    sessionStore: 'ALMACÉN DE SESIONES',
    title: 'Sesión o token: dónde vive el estado',
    token: 'TOKEN AUTOCONTENIDO',
    verify: 'VERIFICAR FIRMA',
  },
} as const;

/**
Con una sesión, el servidor guarda el estado y puede revocarlo al instante. Con un token
autocontenido, el servidor solo verifica la firma; revocarlo exige una lista de bloqueo.
*/
export function sesionesTokensSso(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 60, copy.title, { size: 15 }),
    line(320, 100, 320, 330, { dash: '3 5', stroke: 'faint', width: 1 }),
    label(160, 104, copy.session, { size: 10, tone: 'muted', tracking: 1.4 }),
    label(480, 104, copy.token, { size: 10, tone: 'muted', tracking: 1.4 }),
    group(
      [
        rect(50, 140, 110, 44, { fill: 'paper', r: 6, width: 1.4 }),
        label(105, 167, copy.browser, { size: 10, tracking: 1.2 }),
        rect(190, 140, 110, 44, { fill: 'paper', r: 6, width: 1.4 }),
        label(245, 167, copy.server, { size: 10, tracking: 1.2 }),
        rect(190, 250, 110, 44, { fill: 'brandSoft', r: 6, width: 1.4 }),
        label(245, 268, copy.sessionStore, { size: 9, tracking: 1 }),
      ],
      motion('rise'),
    ),
    group(
      [
        arrow(
          [
            [162, 162],
            [186, 162],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [245, 186],
            [245, 246],
          ],
          { tone: 'ink' },
        ),
      ],
      motion('fade', 300),
    ),
    group(
      [
        rect(350, 140, 110, 44, { fill: 'paper', r: 6, width: 1.4 }),
        label(405, 167, copy.browser, { size: 10, tracking: 1.2 }),
        rect(490, 140, 110, 44, { fill: 'paper', r: 6, width: 1.4 }),
        label(545, 167, copy.server, { size: 10, tracking: 1.2 }),
        label(545, 206, copy.verify, { size: 9, tone: 'muted', tracking: 1 }),
      ],
      motion('rise', 400),
    ),
    group(
      [
        arrow(
          [
            [462, 162],
            [486, 162],
          ],
          { tone: 'ink' },
        ),
      ],
      motion('fade', 600),
    ),
    group(
      [
        rect(350, 250, 250, 44, { dash: '4 4', fill: 'accent', r: 6, stroke: undefined }),
        label(475, 277, copy.revoke, { size: 10, tone: 'paper', tracking: 1 }),
      ],
      motion('rise', 800),
    ),
    label(320, 372, copy.note, { size: 10, tone: 'muted' }),
  );
}
