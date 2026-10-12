import type { Tone } from './figure-types';

/**
Paleta de papel y tinta (tema claro) para los renderizadores que no usan CSS: tarjetas
sociales y vistas previas. Mantén los valores alineados con `src/styles/theme.css`.
*/
export const paperPalette: Readonly<Record<Tone, string>> = {
  accent: '#e2723a',
  accentMid: '#f1b790',
  accentSoft: '#fbe7da',
  brand: '#3b55c4',
  brandMid: '#b3c0f1',
  brandSoft: '#e4eafb',
  faint: '#d6cfc3',
  ink: '#171512',
  muted: '#6b655d',
  paper: '#fbf9f5',
  sunken: '#f1ede6',
};
