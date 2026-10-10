import type { VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

import { buttonVariants } from './Button.variants';

type ButtonProps = Readonly<
  ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>
>;

export function Button({ className, size, type = 'button', variant, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ size, variant }), className)} type={type} {...props} />
  );
}
