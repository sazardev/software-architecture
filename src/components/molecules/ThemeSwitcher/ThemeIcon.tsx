import type { ThemePreference } from '@/lib/theme/themes';

type ThemeIconProps = Readonly<{
  theme: ThemePreference;
}>;

export function ThemeIcon({ theme }: ThemeIconProps) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {theme === 'light' ? (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </>
      ) : null}
      {theme === 'dark' ? <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /> : null}
      {theme === 'system' ? (
        <>
          <rect height="12" rx="2" width="18" x="3" y="5" />
          <path d="M8 21h8m-4-4v4" />
        </>
      ) : null}
    </svg>
  );
}
