import type { ArticleBlock } from './article-blocks';
import { escapeHtml, inlineToHtml, inlineToText, type ArticleInline } from './article-inline';

type TableBlock = Extract<ArticleBlock, { type: 'table' }>;

export type ArticleTextOptions = { headingOffset: number; locale: string; url: string };

/**
Texto markdown plano de los bloques: lo consume /<locale>/llms-full.txt para que un
modelo lea el artículo completo sin ejecutar JavaScript.
*/
export function blocksToText(blocks: ArticleBlock[], options: ArticleTextOptions): string {
  return blocks.map((block) => blockToText(block, options)).join('\n\n');
}

function blockToText(block: ArticleBlock, options: ArticleTextOptions): string {
  switch (block.type) {
    case 'heading': {
      const level = Math.min(block.level + options.headingOffset, 6);

      return `${'#'.repeat(level)} [${block.text}](${options.url}#${block.id})`;
    }

    case 'paragraph': {
      return inlineToText(block.content, options.locale);
    }

    case 'quote': {
      return `> ${inlineToText(block.content, options.locale)}`;
    }

    case 'list': {
      return block.items
        .map((item, index) => {
          const marker = block.ordered ? `${index + 1}.` : '-';

          return `${marker} ${inlineToText(item, options.locale)}`;
        })
        .join('\n');
    }

    case 'code': {
      return [`\`\`\`${block.language}`, ...block.lines, '```'].join('\n');
    }

    case 'table': {
      return tableToText(block, options.locale);
    }
  }
}

function tableToText(block: TableBlock, locale: string): string {
  const rows = block.rows.map(
    (row) => `| ${row.map((cell) => inlineToText(cell, locale)).join(' | ')} |`,
  );

  if (!block.hasHeader || rows.length === 0) {
    return rows.join('\n');
  }

  const divider = `| ${(block.rows[0] ?? []).map(() => '---').join(' | ')} |`;

  return [rows[0] ?? '', divider, ...rows.slice(1)].join('\n');
}

/**
HTML semántico de los bloques: viaja dentro del <noscript> del HTML estático para que
los crawlers sin JavaScript (incluidos los de IA) lean el artículo completo.
*/
export function blocksToHtml(blocks: ArticleBlock[], locale: string): string {
  return blocks.map((block) => blockToHtml(block, locale)).join('\n');
}

function blockToHtml(block: ArticleBlock, locale: string): string {
  switch (block.type) {
    case 'heading': {
      const id = block.id === '' ? '' : ` id="${escapeHtml(block.id)}"`;

      return `<h${block.level}${id}>${escapeHtml(block.text)}</h${block.level}>`;
    }

    case 'paragraph': {
      return `<p>${inlineToHtml(block.content, locale)}</p>`;
    }

    case 'quote': {
      return `<blockquote><p>${inlineToHtml(block.content, locale)}</p></blockquote>`;
    }

    case 'list': {
      const tag = block.ordered ? 'ol' : 'ul';
      const items = block.items
        .map((item) => `  <li>${inlineToHtml(item, locale)}</li>`)
        .join('\n');

      return `<${tag}>\n${items}\n</${tag}>`;
    }

    case 'code': {
      const language =
        block.language === '' ? '' : ` class="language-${escapeHtml(block.language)}"`;

      return `<pre><code${language}>${escapeHtml(block.lines.join('\n'))}</code></pre>`;
    }

    case 'table': {
      return tableToHtml(block, locale);
    }
  }
}

function rowToHtml(row: ArticleInline[][], tag: 'td' | 'th', locale: string): string {
  const cells = row.map((cell) => `<${tag}>${inlineToHtml(cell, locale)}</${tag}>`).join('');

  return `  <tr>${cells}</tr>`;
}

function tableToHtml(block: TableBlock, locale: string): string {
  const [header, ...body] = block.rows;
  const head =
    header !== undefined && block.hasHeader
      ? `<thead>\n${rowToHtml(header, 'th', locale)}\n</thead>`
      : '';
  const rows = (block.hasHeader ? body : block.rows)
    .map((row) => rowToHtml(row, 'td', locale))
    .join('\n');

  return `<table>\n${[head, rows].filter((part) => part !== '').join('\n')}\n</table>`;
}
