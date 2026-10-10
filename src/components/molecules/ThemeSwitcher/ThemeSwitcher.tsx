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
        'inline-flex h-7 w-7 items-center justify-center rounded text-neutral-500 transition-colors hover:text-brand-600 dark:text-neutral-400 dark:hover:text-brand-400',
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
