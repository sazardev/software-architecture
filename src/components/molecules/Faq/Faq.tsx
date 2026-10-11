import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type FaqProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function Faq({ children, className }: FaqProps) {
  return <div className={cn('my-6 grid gap-3', className)}>{children}</div>;
}
