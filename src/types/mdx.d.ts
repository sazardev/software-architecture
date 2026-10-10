declare module '*.mdx' {
  import type { MDXProps } from 'mdx/types';
  import type { ReactElement } from 'react';

  export const frontmatter: Record<string, unknown> | undefined;
  export default function MDXContent(properties: MDXProps): ReactElement;
}
