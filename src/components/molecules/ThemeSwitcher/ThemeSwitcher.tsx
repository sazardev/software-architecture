import { useMessages } from '@/lib/i18n/use-messages';
import { useTheme } from '@/lib/theme/theme-context';
import { nextThemePreference, type ThemePreference } from '@/lib/theme/themes';
import { cn } from '@/lib/utils/cn';

import { ThemeIcon } from './ThemeIcon';

export function ThemeSwitcher() {
  const messages = useMessages();
  const { preference, setPreference } = useTheme();

  const labels: Record<ThemePreference, string> = {
    dark: messages.theme.dark,
    light: messages.theme.light,
    system: messages.theme.system,
  };

  const next = nextThemePreference(preference);
  const actionLabel = messages.theme.switchTo(labels[next]);

  return (
    <button
      aria-label={actionLabel}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors duration-300 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-300 dark:hover:text-neutral-50',
      )}
      onClick={() => {
        setPreference(next);
      }}
      title={actionLabel}
      type="button"
    >
      <ThemeIcon theme={preference} />
    </button>
  );
}
