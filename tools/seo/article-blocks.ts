import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { extractHeadings, type ContentHeading } from '../content/extract-headings';
import { parseFrontmatter } from '../content/parse-frontmatter';

import { inlineText, parseInline, type ArticleInline } from './article-inline';

export type ArticleBlock =
  | { type: 'code'; language: string; lines: string[] }
  | { type: 'heading'; id: string; level: number; text: string }
  | { type: 'list'; items: ArticleInline[][]; ordered: boolean }
  | { type: 'paragraph'; content: ArticleInline[] }
  | { type: 'quote'; content: ArticleInline[] }
  | { type: 'table'; hasHeader: boolean; rows: ArticleInline[][][] };

type Segment =
  { kind: 'code'; language: string; lines: string[] } | { kind: 'text'; lines: string[] };

type HeadingCursor = { heading: number };

const headingPattern = /^(#{1,6})\s+(.+)$/;
const fencePattern = /^\s*```([A-Za-z0-9+#-]*)(?:\s+.*)?$/;
const listItemPattern = /^\s*(?:[-*+]|\d{1,3}\.)\s+(.+)$/;
const orderedItemPattern = /^\s*\d{1,3}\.\s/;
const quotePattern = /^>\s?(.*)$/;
const tableRowPattern = /^\s*\|.*\|\s*$/;
const dividerCellPattern = /^:?-{2,}:?$/;
const standaloneTagPattern = /^\s*<\/?[A-Za-z][\w.-]*(?:\s[^>]*)?\/?>\s*$/;
const openTagPattern = /^\s*<[A-Za-z][\w.-]*\s[^>]*$/;
const continuationPattern = /^\s{2,}\S/;

const docsDir = join(process.cwd(), 'src', 'content', 'docs');

/**
Cuerpo del MDX de un artículo, sin frontmatter. Lo usan el HTML estático y llms-full.txt.
*/
export async function readDocBody(locale: string, slug: string): Promise<string> {
  const source = await readFile(join(docsDir, locale, `${slug}.mdx`), 'utf8');

  return parseFrontmatter(source).body;
}

/**
Convierte el cuerpo de un artículo en bloques (encabezados, párrafos, listas, tablas,
citas y código). Los componentes MDX se descartan y su contenido se conserva, y las
anclas de los encabezados coinciden con las del sitio porque salen de `extractHeadings`.
*/
export function parseArticleBlocks(markdown: string): ArticleBlock[] {
  const headings = extractHeadings(markdown);
  const cursor: HeadingCursor = { heading: 0 };
  const blocks: ArticleBlock[] = [];

  for (const segment of splitSegments(markdown)) {
    if (segment.kind === 'code') {
      blocks.push({ type: 'code', language: segment.language, lines: segment.lines });
    } else {
      blocks.push(...linesToBlocks(segment.lines, cursor, headings));
    }
  }

  return blocks.filter(
    (block) => block.type !== 'heading' || (block.level > 1 && block.text !== ''),
  );
}

function isSkippable(line: string): boolean {
  return (
    /^\s*(?:import|export)\s/.test(line) ||
    /^\s*\{.*\}\s*$/.test(line) ||
    /^\s*<!--/.test(line) ||
    /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line) ||
    standaloneTagPattern.test(line)
  );
}

function trimBlankLines(lines: string[]): string[] {
  let start = 0;
  let end = lines.length;

  while (start < end && (lines[start] ?? '').trim() === '') {
    start += 1;
  }

  while (end > start && (lines[end - 1] ?? '').trim() === '') {
    end -= 1;
  }

  return lines.slice(start, end);
}

function pushCode(segments: Segment[], fence: { language: string; lines: string[] }): void {
  segments.push({ kind: 'code', language: fence.language, lines: trimBlankLines(fence.lines) });
}

function splitSegments(markdown: string): Segment[] {
  const segments: Segment[] = [];
  let buffer: string[] = [];
  let fence: { language: string; lines: string[] } | undefined;
  let isInsideTag = false;

  const flush = (): void => {
    if (buffer.length === 0) {
      return;
    }

    segments.push({ kind: 'text', lines: buffer });
    buffer = [];
  };

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trimEnd();
    const fenceMatch = fencePattern.exec(line);

    if (fence !== undefined && fenceMatch === null) {
      fence.lines.push(rawLine);
      continue;
    }

    if (fence !== undefined) {
      pushCode(segments, fence);
      fence = undefined;
      continue;
    }

    if (fenceMatch !== null) {
      flush();
      fence = { language: fenceMatch[1] ?? '', lines: [] };
      continue;
    }

    if (isInsideTag) {
      isInsideTag = !line.includes('>');
      continue;
    }

    if (openTagPattern.test(line)) {
      flush();
      isInsideTag = true;
      continue;
    }

    if (line.trim() === '' || isSkippable(line)) {
      flush();
      continue;
    }

    buffer.push(line);
  }

  if (fence !== undefined) {
    pushCode(segments, fence);
  }

  flush();

  return segments;
}

function linesToBlocks(
  lines: string[],
  cursor: HeadingCursor,
  headings: ContentHeading[],
): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  let rest = lines;

  while (rest.length > 0) {
    const [block, next] = takeBlock(rest, cursor, headings);

    blocks.push(block);
    rest = next;
  }

  return blocks;
}

function isBlockStart(line: string): boolean {
  return (
    headingPattern.test(line) ||
    listItemPattern.test(line) ||
    tableRowPattern.test(line) ||
    quotePattern.test(line)
  );
}

function takeWhile(lines: string[], isMatch: (line: string) => boolean): string[] {
  let index = 0;

  while (index < lines.length && isMatch(lines[index] ?? '')) {
    index += 1;
  }

  return lines.slice(0, index);
}

function takeListLines(lines: string[]): string[] {
  const group: string[] = [];

  for (const line of lines) {
    const isItem = listItemPattern.test(line);
    const isContinuation = group.length > 0 && continuationPattern.test(line);

    if (!isItem && !isContinuation) {
      break;
    }

    group.push(line);
  }

  return group;
}

function takeBlock(
  lines: string[],
  cursor: HeadingCursor,
  headings: ContentHeading[],
): [ArticleBlock, string[]] {
  const first = lines[0] ?? '';

  if (headingPattern.test(first)) {
    return [headingBlock(first, cursor, headings), lines.slice(1)];
  }

  if (listItemPattern.test(first)) {
    const group = takeListLines(lines);

    return [listBlock(group), lines.slice(group.length)];
  }

  if (tableRowPattern.test(first)) {
    const group = takeWhile(lines, (line) => tableRowPattern.test(line));

    return [tableBlock(group), lines.slice(group.length)];
  }

  if (quotePattern.test(first)) {
    const group = takeWhile(lines, (line) => quotePattern.test(line));

    return [quoteBlock(group), lines.slice(group.length)];
  }

  const group = takeWhile(lines, (line) => !isBlockStart(line));

  return [paragraphBlock(group), lines.slice(group.length)];
}

function headingBlock(
  line: string,
  cursor: HeadingCursor,
  headings: ContentHeading[],
): ArticleBlock {
  const level = headingPattern.exec(line)?.[1]?.length ?? 2;
  const text = inlineText(parseInline(line.replace(/^#{1,6}\s*/, '').replace(/#+\s*$/, '')));
  const heading = text === '' ? undefined : headings[cursor.heading];

  if (heading !== undefined) {
    cursor.heading += 1;
  }

  return { type: 'heading', id: heading?.id ?? '', level, text };
}

function listBlock(lines: string[]): ArticleBlock {
  const isOrdered = orderedItemPattern.test(lines[0] ?? '');
  const items: string[] = [];
  let current: string | undefined;

  for (const line of lines) {
    const content = listItemPattern.exec(line)?.[1];

    if (content !== undefined) {
      if (current !== undefined) {
        items.push(current);
      }

      current = content.trim();
    } else if (current !== undefined) {
      current += ` ${line.trim()}`;
    }
  }

  if (current !== undefined) {
    items.push(current);
  }

  return { type: 'list', items: items.map((item) => parseInline(item)), ordered: isOrdered };
}

function rowCells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isDividerRow(cells: string[] | undefined): boolean {
  return (
    cells !== undefined && cells.length > 0 && cells.every((cell) => dividerCellPattern.test(cell))
  );
}

function tableBlock(lines: string[]): ArticleBlock {
  const cells = lines.map((line) => rowCells(line));
  const hasHeader = isDividerRow(cells[1]);
  const rows = hasHeader ? cells.toSpliced(1, 1) : cells;

  return {
    type: 'table',
    hasHeader,
    rows: rows.map((row) => row.map((cell) => parseInline(cell))),
  };
}

function quoteBlock(lines: string[]): ArticleBlock {
  const content = lines.map((line) => quotePattern.exec(line)?.[1] ?? '').join(' ');

  return { type: 'quote', content: parseInline(content) };
}

function paragraphBlock(lines: string[]): ArticleBlock {
  return { type: 'paragraph', content: parseInline(lines.join(' ')) };
}
