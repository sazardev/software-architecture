import { figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    app: 'WORKLOAD',
    blocked: 'secret in git: blocked',
    key: 'key manager · master key',
    note: 'the workload proves who it is; no static secret travels',
    repo: 'REPO',
    title: 'Secrets stay out of the code and out of sight',
    vault: 'VAULT',
  },
  es: {
    app: 'CARGA',
    blocked: 'secreto en git: bloqueado',
    key: 'gestor de claves · clave maestra',
    note: 'la carga demuestra quién es; ningún secreto estático viaja',
    repo: 'REPO',
    title: 'Los secretos fuera del código y fuera de la vista',
    vault: 'BÓVEDA',
  },
} as const;

/**
El repositorio nunca guarda secretos. La carga se identifica ante la bóveda y recibe credenciales
de vida corta; la clave que cifra los secretos vive aparte, en su propio gestor.
*/
export function gestionSecretosClaves(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 66, copy.title, { size: 15 }),
    group(
      [
        rect(40, 150, 140, 70, { fill: 'paper', r: 8, width: 1.5 }),
        label(110, 191, copy.repo, { size: 11, tracking: 1.4 }),
      ],
      motion('rise'),
    ),
    group(
      [
        line(190, 185, 240, 185, { dash: '5 5', stroke: 'accent', width: 1.6 }),
        label(215, 128, copy.blocked, { size: 9.5, tone: 'accent' }),
      ],
      motion('draw', 300),
    ),
    group(
      [
        rect(260, 140, 170, 100, { fill: 'brandSoft', r: 10, width: 1.5 }),
        label(345, 180, copy.vault, { size: 12, tracking: 1.6 }),
      ],
      motion('rise', 200),
    ),
    group(
      [
        line(345, 240, 345, 262, { stroke: 'ink', width: 1.4 }),
        rect(245, 262, 200, 46, { dash: '4 4', fill: 'paper', r: 8, stroke: 'muted', width: 1.4 }),
        label(345, 289, copy.key, { size: 9.5, tone: 'muted' }),
      ],
      motion('rise', 350),
    ),
    group(
      [
        rect(480, 150, 130, 70, { fill: 'paper', r: 8, width: 1.5 }),
        label(545, 191, copy.app, { size: 11, tracking: 1.4 }),
      ],
      motion('rise', 400),
    ),
    label(320, 350, copy.note, { tone: 'muted' }),
  );
}
