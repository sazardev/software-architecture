import { parse as parseYaml } from 'yaml';

export type ParsedDocument = {
  body: string;
  frontmatter: unknown;
};

const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function parseFrontmatter(source: string): ParsedDocument {
  const match = frontmatterPattern.exec(source);

  if (match?.[1] === undefined) {
    return { body: source, frontmatter: {} };
  }

  return {
    body: source.slice(match[0].length),
    frontmatter: parseYaml(match[1]),
  };
}
