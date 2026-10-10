import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';

type MdxJsxAttribute = {
  type: 'mdxJsxAttribute';
  name: string;
  value: string;
};

type MdxJsxFlowElement = {
  type: 'mdxJsxFlowElement';
  name: string;
  attributes: MdxJsxAttribute[];
  children: [];
};

function transformMermaidCodeBlocks(tree: Root): void {
  visit(tree, 'code', (node, index, parent) => {
    if (!parent || index === undefined || node.lang !== 'mermaid') {
      return;
    }

    const element: MdxJsxFlowElement = {
      type: 'mdxJsxFlowElement',
      name: 'MermaidDiagram',
      attributes: [{ type: 'mdxJsxAttribute', name: 'chart', value: node.value }],
      children: [],
    };

    parent.children[index] = element;
  });
}

export function remarkMermaid() {
  return transformMermaidCodeBlocks;
}
