import { getDocsBySection, getTopTags, type TagCount } from '@/lib/content/registry';
import { getSectionLabel, getSectionText } from '@/lib/content/taxonomy';
import { getLocaleDefinition, locales } from '@/lib/i18n/locales';
import { getRoadmapPaths, getRoadmapText } from '@/lib/roadmap/roadmap-registry';
import { parsePaletteQuery } from '@/lib/search/palette-query';
import type {
  PaletteContext,
  PaletteGroup,
  PaletteGroupId,
  PaletteItem,
} from '@/lib/search/palette-types';
import { normalize, searchDocs, type SearchResult } from '@/lib/search/search';
import { nextThemePreference } from '@/lib/theme/themes';

const MAX_DOCS = 12;
const MAX_TAGS = 8;
const SUGGESTED_DOCS = 6;
const SUGGESTED_TAGS = 6;

function docItems(results: SearchResult[], context: PaletteContext, limit: number): PaletteItem[] {
  const { locale } = context;

  return results.slice(0, limit).map(({ entry, heading }) => ({
    action: { hash: heading?.id, slug: entry.slug, type: 'doc' },
    detail: heading === undefined ? entry.description : `→ ${heading.text}`,
    id: `doc:${entry.slug}`,
    label: entry.title,
    meta: getSectionLabel(entry.category, locale),
  }));
}

function topicItems({ locale, messages }: PaletteContext): PaletteItem[] {
  return getDocsBySection(locale).map(({ docs, section }) => {
    const text = getSectionText(section, locale);

    return {
      action: { sectionId: section.id, type: 'section' },
      detail: text.description,
      id: `topic:${section.id}`,
      label: text.label,
      meta: messages.docs.articleCount(docs.length),
    };
  });
}

function tagItems(tags: TagCount[], { messages }: PaletteContext): PaletteItem[] {
  return tags.map(({ count, tag }) => ({
    action: { tag, type: 'tag' },
    detail: undefined,
    id: `tag:${tag}`,
    label: `#${tag}`,
    meta: messages.docs.articleCount(count),
  }));
}

function roadmapItems({ locale, messages }: PaletteContext): PaletteItem[] {
  return getRoadmapPaths(locale).map(({ roadmap, steps }) => {
    const text = getRoadmapText(roadmap, locale);

    return {
      action: { roadmapId: roadmap.id, type: 'roadmap' },
      detail: text.description,
      id: `roadmap:${roadmap.id}`,
      label: messages.palette.actions.roadmap(text.label),
      meta: messages.roadmap.stepCount(steps.length),
    };
  });
}

function navigationItems(context: PaletteContext): PaletteItem[] {
  const { actions } = context.messages.palette;

  return [
    {
      action: { page: 'home', type: 'page' },
      detail: undefined,
      id: 'page:home',
      label: actions.home,
      meta: undefined,
    },
    {
      action: { page: 'docs', type: 'page' },
      detail: undefined,
      id: 'page:docs',
      label: actions.docs,
      meta: undefined,
    },
    {
      action: { page: 'roadmap', type: 'page' },
      detail: undefined,
      id: 'page:roadmap',
      label: actions.roadmaps,
      meta: undefined,
    },
    ...roadmapItems(context),
  ];
}

function settingsItems({ locale, messages, theme }: PaletteContext): PaletteItem[] {
  const nextTheme = nextThemePreference(theme);
  const themeNames = {
    dark: messages.theme.dark,
    light: messages.theme.light,
    system: messages.theme.system,
  };

  const languageItems = locales
    .filter((code) => code !== locale)
    .map((code): PaletteItem => {
      return {
        action: { locale: code, type: 'locale' },
        detail: undefined,
        id: `locale:${code}`,
        label: messages.palette.actions.language(getLocaleDefinition(code).label),
        meta: code.toUpperCase(),
      };
    });

  return [
    {
      action: { next: nextTheme, type: 'theme' },
      detail: undefined,
      id: 'theme:next',
      label: messages.palette.actions.theme(themeNames[nextTheme]),
      meta: undefined,
    },
    ...languageItems,
  ];
}

function hasAllTokens(label: string, tokens: string[]): boolean {
  const haystack = normalize(label);

  return tokens.every((token) => haystack.includes(token));
}

function isTagMatch(tag: string, prefix: string | undefined, tokens: string[]): boolean {
  const hasPrefix = prefix === undefined || tag.startsWith(prefix);

  return hasPrefix && hasAllTokens(tag, tokens);
}

function filterByLabel(items: PaletteItem[], tokens: string[]): PaletteItem[] {
  return items.filter((item) => hasAllTokens(item.label, tokens));
}

function toGroups(
  context: PaletteContext,
  entries: readonly (readonly [PaletteGroupId, PaletteItem[]])[],
): PaletteGroup[] {
  return entries
    .filter(([, items]) => items.length > 0)
    .map(([id, items]) => ({ id, items, label: context.messages.palette.groups[id] }));
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(/\s+/)
    .filter((token) => token !== '');
}

function suggestedGroups(context: PaletteContext, tags: TagCount[]): PaletteGroup[] {
  const { locale } = context;
  const suggestedDocs = getDocsBySection(locale)
    .flatMap((group) => group.docs)
    .slice(0, SUGGESTED_DOCS)
    .map((entry) => ({ entry, heading: undefined, score: 0 }));

  return toGroups(context, [
    ['docs', docItems(suggestedDocs, context, SUGGESTED_DOCS)],
    ['topics', topicItems(context)],
    ['tags', tagItems(tags.slice(0, SUGGESTED_TAGS), context)],
    ['navigation', navigationItems(context)],
    ['settings', settingsItems(context)],
  ]);
}

/**
Construye los grupos de la paleta para una consulta. Sintaxis: texto libre y `#etiqueta`.
*/
export function buildPalette(rawQuery: string, context: PaletteContext): PaletteGroup[] {
  const { locale, messages } = context;
  const allTags = getTopTags(locale, Infinity);
  const query = parsePaletteQuery(
    rawQuery,
    allTags.map(({ tag }) => tag),
  );

  if (query.tag !== undefined) {
    const results = searchDocs(query.text, { locale, tag: query.tag });
    const group: PaletteGroup = {
      id: 'docs',
      items: docItems(results, context, MAX_DOCS),
      label: messages.palette.taggedWith(query.tag),
    };

    return group.items.length === 0 ? [] : [group];
  }

  const tokens = tokenize(query.text);
  const { tagPrefix } = query;

  if (tagPrefix === undefined && tokens.length === 0) {
    return suggestedGroups(context, allTags);
  }

  const matchingTags = allTags.filter(({ tag }) => isTagMatch(tag, tagPrefix, tokens));
  const tags = tagItems(matchingTags.slice(0, MAX_TAGS), context);

  if (tokens.length === 0) {
    return toGroups(context, [['tags', tags]]);
  }

  const docs = docItems(searchDocs(query.text, { locale }), context, MAX_DOCS);

  return toGroups(context, [
    ['docs', docs],
    ['topics', filterByLabel(topicItems(context), tokens)],
    ['tags', tags],
    ['navigation', filterByLabel(navigationItems(context), tokens)],
    ['settings', filterByLabel(settingsItems(context), tokens)],
  ]);
}
