import { absoluteUrl } from '@/lib/seo/absolute-url';

export type ArticleInline = {
  code?: boolean;
  href?: string;
  text: string;
};

type InlineToken = (match: RegExpMatchArray) => ArticleInline | undefined;

type InlineMatch = { length: number; token: ArticleInline | undefined };

const linkPattern = /(!?)\[([^\]]+)\]\(([^)\s]+)\)/y;
const codePattern = /`([^`]+)`/y;
const strongPattern = /[*_]{2}([^*_]+)[*_]{2}/y;
const emphasisPattern = /[*_]([^*_]+)[*_]/y;

function collapse(value: string): string {
  return value.replaceAll(/<\/?[A-Za-z][^>]*>/g, ' ').replaceAll(/\s+/g, ' ');
}

function textToken(value: string): ArticleInline | undefined {
  const text = collapse(value).trim();

  return text === '' ? undefined : { text };
}

function linkToken(match: RegExpMatchArray): ArticleInline | undefined {
  const [, image, linkText, href] = match;

  if (linkText === undefined || href === undefined) {
    return undefined;
  }

  if (image === '!') {
    return textToken(linkText);
  }

  const text = collapse(linkText).trim();

  return text === '' ? undefined : { href, text };
}

function codeToken(match: RegExpMatchArray): ArticleInline | undefined {
  const code = match[1];

  return code === undefined ? undefined : { code: true, text: code.trim() };
}

function emphasisToken(match: RegExpMatchArray): ArticleInline | undefined {
  const content = match[1];

  return content === undefined ? undefined : textToken(content);
}

function matchPattern(
  pattern: RegExp,
  toToken: InlineToken,
  text: string,
  cursor: number,
): InlineMatch | undefined {
  pattern.lastIndex = cursor;

  const match = pattern.exec(text);

  return match === null ? undefined : { length: match[0].length, token: toToken(match) };
}

function matchAt(text: string, cursor: number): InlineMatch | undefined {
  return (
    matchPattern(linkPattern, linkToken, text, cursor) ??
    matchPattern(codePattern, codeToken, text, cursor) ??
    matchPattern(strongPattern, emphasisToken, text, cursor) ??
    matchPattern(emphasisPattern, emphasisToken, text, cursor)
  );
}

/**
Convierte una línea de markdown en tokens: texto, enlaces y código en línea.
Las etiquetas JSX se eliminan y las imágenes se degradan a su texto alternativo.
*/
export function parseInline(text: string): ArticleInline[] {
  const tokens: ArticleInline[] = [];
  let plain = '';
  let cursor = 0;

  const flushPlain = (): void => {
    const collapsed = collapse(plain);

    if (collapsed !== '') {
      tokens.push({ text: collapsed });
    }

    plain = '';
  };

  while (cursor < text.length) {
    const match = matchAt(text, cursor);

    if (match === undefined) {
      plain += text[cursor] ?? '';
      cursor += 1;
      continue;
    }

    flushPlain();

    if (match.token !== undefined) {
      tokens.push(match.token);
    }

    cursor += match.length;
  }

  flushPlain();

  return tokens;
}

export function inlineText(tokens: ArticleInline[]): string {
  return tokens
    .map((token) => token.text)
    .join('')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

export function resolveHref(href: string, locale: string): string {
  if (!href.startsWith('/')) {
    return href;
  }

  const prefix = `/${locale}`;

  if (href === prefix || href.startsWith(`${prefix}/`) || href.startsWith(`${prefix}#`)) {
    return absoluteUrl(href);
  }

  return absoluteUrl(`${prefix}${href === '/' ? '' : href}`);
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function inlineToText(tokens: ArticleInline[], locale: string): string {
  return tokens
    .map((token) => inlineTokenToText(token, locale))
    .join('')
    .trim();
}

function inlineTokenToText(token: ArticleInline, locale: string): string {
  if (token.code === true) {
    return `\`${token.text}\``;
  }

  return token.href === undefined
    ? token.text
    : `[${token.text}](${resolveHref(token.href, locale)})`;
}

export function inlineToHtml(tokens: ArticleInline[], locale: string): string {
  return tokens
    .map((token) => inlineTokenToHtml(token, locale))
    .join('')
    .trim();
}

function inlineTokenToHtml(token: ArticleInline, locale: string): string {
  if (token.code === true) {
    return `<code>${escapeHtml(token.text)}</code>`;
  }

  return token.href === undefined
    ? escapeHtml(token.text)
    : `<a href="${escapeHtml(resolveHref(token.href, locale))}">${escapeHtml(token.text)}</a>`;
}
