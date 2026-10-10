import GithubSlugger from 'github-slugger';

export type ContentHeading = {
  id: string;
  level: number;
  text: string;
};

const headingPattern = /^(#{1,6})\s+(.+)$/;

function stripInlineMarkdown(text: string): string {
  return text
    .replaceAll(/`([^`]*)`/g, '$1')
    .replaceAll(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replaceAll(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, '$1')
    .replaceAll(/<[^>]+>/g, '')
    .replace(/#+\s*$/, '')
    .trim();
}

export function extractHeadings(markdown: string): ContentHeading[] {
  const slugger = new GithubSlugger();
  const headings: ContentHeading[] = [];
  let isInFence = false;

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trimEnd();

    if (line.trimStart().startsWith('```')) {
      isInFence = !isInFence;
      continue;
    }

    if (isInFence) {
      continue;
    }

    const match = headingPattern.exec(line);

    if (match?.[1] === undefined || match[2] === undefined) {
      continue;
    }

    const text = stripInlineMarkdown(match[2]);

    if (text.length === 0) {
      continue;
    }

    headings.push({ id: slugger.slug(text), level: match[1].length, text });
  }

  return headings;
}
