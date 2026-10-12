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
      className="flex items-center rounded-full border border-neutral-200 p-0.5 font-sans text-[0.7rem] dark:border-neutral-800"
      role="group"
    >
      {localeDefinitions.map((definition) => {
        const isActive = definition.code === locale;

        return (
          <Link
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'rounded-full px-2.5 py-1 leading-none font-semibold tracking-wider uppercase transition-colors duration-300',
              isActive
                ? 'bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50',
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
