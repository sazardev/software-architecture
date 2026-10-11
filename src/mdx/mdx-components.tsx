import type { MDXComponents } from 'mdx/types';
import { lazy, Suspense } from 'react';

import {
  Callout,
  Checklist,
  ExerciseCard,
  Faq,
  FaqItem,
  FragileInheritanceNote,
} from '@/components/molecules';
import { MermaidDiagram } from '@/components/organisms';
import type { InteractiveMapProps } from '@/components/organisms/InteractiveMap';

const InteractiveMapImpl = lazy(async () => {
  const module = await import('@/components/organisms/InteractiveMap');
  return { default: module.InteractiveMap };
});

function InteractiveMap(props: InteractiveMapProps) {
  return (
    <Suspense
      fallback={
        <div className="my-6 h-80 animate-pulse rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900" />
      }
    >
      <InteractiveMapImpl {...props} />
    </Suspense>
  );
}

export const mdxComponents: MDXComponents = {
  Callout,
  Checklist,
  ExerciseCard,
  Faq,
  FaqItem,
  FragileInheritanceNote,
  InteractiveMap,
  MermaidDiagram,
};
