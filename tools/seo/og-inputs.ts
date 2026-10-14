import { site } from '@/lib/config/site';
import { getDocsByLocale } from '@/lib/content/registry';
import { getSectionLabel } from '@/lib/content/taxonomy';
import type { ContentEntry } from '@/lib/content/types';
import { getFigure } from '@/lib/figures/registry';
import { figureToSvg } from '@/lib/figures/to-svg';
import type { Locale } from '@/lib/i18n/locales';
import { getMessages } from '@/lib/i18n/messages';
import { formatDate } from '@/lib/utils/format-date';

import { figureTextOverlay } from './og-figure-text';
import type { OgCardInput } from './og-kit';

const pad = (value: number): string => String(value).padStart(2, '0');

function siteHost(): string {
  return site.url.replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

export function homeCard(locale: Locale): OgCardInput {
  const messages = getMessages(locale);
  const docs = getDocsByLocale(locale);
  const latest = docs.map((doc) => doc.updatedAt).toSorted((a, b) => b.localeCompare(a))[0];

  return {
    accent: messages.home.titleAccent,
    description: messages.site.description,
    eyebrow: messages.home.eyebrow,
    rows: [
      [messages.blueprint.sheet, `01/${pad(docs.length)}`],
      [messages.blueprint.rev, latest === undefined ? '—' : formatDate(latest, locale)],
    ],
    siteName: site.name,
    siteUrl: siteHost(),
    title: messages.home.titleLead,
  };
}

export async function docCard(entry: ContentEntry): Promise<OgCardInput> {
  const { locale } = entry;
  const messages = getMessages(locale);
  const docs = getDocsByLocale(locale);
  const sheet = docs.findIndex((doc) => doc.slug === entry.slug) + 1;
  const figure = getFigure(entry.slug, locale);

  return {
    description: entry.description,
    eyebrow: getSectionLabel(entry.category, locale),
    // Mismo dibujo que ve el lector; el texto va como trazados porque resvg no tiene las fuentes.
    ...(figure !== undefined && {
      figure: {
        caption: entry.figureCaption,
        label: `${messages.blueprint.figure} ${pad(sheet)}`,
        svg: figureToSvg(figure, { overlay: await figureTextOverlay(figure), text: false }),
      },
    }),
    rows: [
      [messages.blueprint.sheet, `${pad(sheet)}/${pad(docs.length)}`],
      [messages.blueprint.reading, messages.docs.minutesShort(entry.readingMinutes)],
      [messages.blueprint.rev, formatDate(entry.updatedAt, locale)],
    ],
    siteName: site.name,
    siteUrl: siteHost(),
    title: entry.title,
  };
}
