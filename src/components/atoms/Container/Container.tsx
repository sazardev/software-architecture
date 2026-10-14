import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils/cn';

const containerVariants = cva('mx-auto w-full px-5 sm:px-8', {
  defaultVariants: { size: 'wide' },
  variants: {
    size: {
      bleed: 'max-w-[96rem]',
      narrow: 'max-w-3xl',
      reading: 'max-w-4xl',
      wide: 'max-w-6xl',
    },
  },
});

type ContainerProps = Readonly<ComponentProps<'div'> & VariantProps<typeof containerVariants>>;

export function Container({ className, size, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ size }), className)} {...props} />;
}
