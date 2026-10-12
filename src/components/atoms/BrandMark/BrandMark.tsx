import { cn } from '@/lib/utils/cn';

type BrandMarkProps = Readonly<{
  className?: string;
}>;

/**
Isotipo: tres capas apiladas con un núcleo brasa.
*/
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn('h-7 w-7', className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      viewBox="0 0 32 32"
    >
      <path
        d="M16 3 28 9.5 16 16 4 9.5 16 3Z"
        className="fill-brand-200/70 dark:fill-brand-900/70"
      />
      <path d="m4 15.5 12 6.5 12-6.5" />
      <path d="m4 21.5 12 6.5 12-6.5" />
      <circle className="fill-accent-500 stroke-none" cx="16" cy="9.5" r="2" />
    </svg>
  );
}
