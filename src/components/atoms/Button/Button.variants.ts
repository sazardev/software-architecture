import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'group/button inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
    variants: {
      size: {
        lg: 'h-12 px-7 text-[0.95rem]',
        md: 'h-10 px-5 text-sm',
        sm: 'h-8 px-3.5 text-[0.8rem]',
      },
      variant: {
        ghost:
          'text-neutral-700 hover:bg-neutral-200/70 dark:text-neutral-200 dark:hover:bg-neutral-800',
        primary:
          'bg-neutral-900 text-neutral-50 shadow-soft hover:bg-brand-700 hover:shadow-lift dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-brand-300',
        secondary:
          'border border-neutral-300 bg-neutral-50/60 text-neutral-900 hover:border-neutral-900 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-50 dark:hover:border-neutral-300',
      },
    },
  },
);
