import type { Tone } from '@/lib/figures/figure-types';

/**
Traducción de los tonos semánticos de una figura a tokens del tema, siempre con su variante
`dark:`. Las clases son literales para que Tailwind las detecte.
*/
export const fillClass: Readonly<Record<Tone, string>> = {
  accent: 'fill-accent-500 dark:fill-accent-400',
  accentMid: 'fill-accent-300 dark:fill-accent-800',
  accentSoft: 'fill-accent-100 dark:fill-accent-900',
  brand: 'fill-brand-600 dark:fill-brand-300',
  brandMid: 'fill-brand-300 dark:fill-brand-800',
  brandSoft: 'fill-brand-100 dark:fill-brand-900',
  faint: 'fill-neutral-300 dark:fill-neutral-700',
  ink: 'fill-neutral-900 dark:fill-neutral-100',
  muted: 'fill-neutral-500 dark:fill-neutral-400',
  paper: 'fill-neutral-50 dark:fill-neutral-950',
  sunken: 'fill-neutral-100 dark:fill-neutral-900',
};

export const strokeClass: Readonly<Record<Tone, string>> = {
  accent: 'stroke-accent-600 dark:stroke-accent-400',
  accentMid: 'stroke-accent-300 dark:stroke-accent-700',
  accentSoft: 'stroke-accent-100 dark:stroke-accent-900',
  brand: 'stroke-brand-600 dark:stroke-brand-300',
  brandMid: 'stroke-brand-300 dark:stroke-brand-800',
  brandSoft: 'stroke-brand-100 dark:stroke-brand-900',
  faint: 'stroke-neutral-300 dark:stroke-neutral-700',
  ink: 'stroke-neutral-900 dark:stroke-neutral-200',
  muted: 'stroke-neutral-500 dark:stroke-neutral-400',
  paper: 'stroke-neutral-50 dark:stroke-neutral-950',
  sunken: 'stroke-neutral-100 dark:stroke-neutral-900',
};

// Texto: el acento va un paso más oscuro para mantener el contraste sobre papel.
export const textClass: Readonly<Record<Tone, string>> = {
  ...fillClass,
  accent: 'fill-accent-700 dark:fill-accent-400',
  brand: 'fill-brand-700 dark:fill-brand-300',
  faint: 'fill-neutral-400 dark:fill-neutral-600',
};

export const fontClass = {
  display: 'font-display',
  mono: 'font-mono',
  sans: 'font-sans',
} as const;
