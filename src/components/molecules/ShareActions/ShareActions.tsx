import { useMessages } from '@/lib/i18n/use-messages';
import { copyWithToast } from '@/lib/ui/clipboard';
import { nativeShare } from '@/lib/ui/native-share';
import { pageUrl, shareUrl } from '@/lib/ui/reading-links';
import { showToast } from '@/lib/ui/toast';
import { cn } from '@/lib/utils/cn';

import { ShareIcon, type ShareIconName } from './ShareIcon';

type ShareActionsProps = Readonly<{
  className?: string;
  // `rail`: columna de iconos con tooltip (margen izquierdo). `row`: botones con texto.
  layout: 'rail' | 'row';
  title: string;
}>;

type ShareAction = Readonly<{
  icon: ShareIconName;
  id: string;
  label: string;
  run: () => void;
}>;

function openExternal(url: string) {
  open(url, '_blank', 'noopener,noreferrer');
}

function currentUrl(): string {
  return pageUrl(location);
}

export function ShareActions({ className, layout, title }: ShareActionsProps) {
  const { share } = useMessages();

  const actions: ShareAction[] = [
    {
      icon: 'link',
      id: 'copy',
      label: share.copyLink,
      run: () => {
        void copyWithToast(currentUrl(), () => {
          showToast(share.linkCopied);
        });
      },
    },
    ...(typeof navigator.share === 'function'
      ? [
          {
            icon: 'share',
            id: 'native',
            label: share.native,
            run: () => {
              void nativeShare({ title, url: currentUrl() });
            },
          } satisfies ShareAction,
        ]
      : []),
    {
      icon: 'x',
      id: 'x',
      label: share.x,
      run: () => {
        openExternal(shareUrl('x', currentUrl(), title));
      },
    },
    {
      icon: 'linkedin',
      id: 'linkedin',
      label: share.linkedin,
      run: () => {
        openExternal(shareUrl('linkedin', currentUrl(), title));
      },
    },
    {
      icon: 'email',
      id: 'email',
      label: share.email,
      run: () => {
        location.assign(shareUrl('email', currentUrl(), title));
      },
    },
  ];

  const isRail = layout === 'rail';

  return (
    <div
      aria-label={share.label}
      className={cn(isRail ? 'flex flex-col gap-2' : 'flex flex-wrap gap-2', className)}
      role="group"
    >
      {actions.map((action) => (
        <button
          aria-label={action.label}
          className={cn(
            'group/tip relative inline-flex h-10 items-center justify-center gap-2.5 border border-neutral-300 font-sans text-sm text-neutral-600 transition-colors duration-300 hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-300 dark:hover:text-neutral-50',
            isRail ? 'w-10' : 'px-4',
          )}
          key={action.id}
          onClick={action.run}
          type="button"
        >
          <ShareIcon name={action.icon} />
          {isRail ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-full mr-3 bg-neutral-900 px-2.5 py-1.5 font-mono text-[0.68rem] tracking-[0.08em] whitespace-nowrap text-neutral-50 opacity-0 transition-opacity duration-200 group-hover/tip:opacity-100 group-focus-visible/tip:opacity-100 dark:bg-neutral-50 dark:text-neutral-900"
            >
              {action.label}
            </span>
          ) : (
            <span>{action.label}</span>
          )}
        </button>
      ))}
    </div>
  );
}
