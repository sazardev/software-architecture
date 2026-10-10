import { Link, useLocation } from '@tanstack/react-router';

import { useLocale } from '@/lib/i18n/locale-context';
import { localeDefinitions, switchLocalePath } from '@/lib/i18n/locales';
import { useMessages } from '@/lib/i18n/use-messages';
import { cn } from '@/lib/utils/cn';

export function LanguageSwitcher() {
  const locale = useLocale();
  const messages = useMessages();
  const location = useLocation();

  return (
    <div
      aria-label={messages.languageSwitcher.label}
      className="flex items-center gap-1 text-xs"
      role="group"
    >
      {localeDefinitions.map((definition) => {
        const isActive = definition.code === locale;

        return (
          <Link
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'rounded px-1.5 py-0.5 font-medium uppercase transition-colors',
              isActive
                ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50'
                : 'text-neutral-500 hover:text-brand-600 dark:text-neutral-400 dark:hover:text-brand-400',
            )}
            key={definition.code}
            search={location.search as never}
            title={definition.label}
            to={switchLocalePath(location.pathname, definition.code) as never}
          >
            {definition.code}
          </Link>
        );
      })}
    </div>
  );
}
