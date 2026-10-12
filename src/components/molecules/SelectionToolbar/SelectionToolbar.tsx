import { useEffect, useRef, useState } from 'react';

import { ShareIcon, type ShareIconName } from '@/components/molecules/ShareActions/ShareIcon';
import { site } from '@/lib/config/site';
import { useMessages } from '@/lib/i18n/use-messages';
import { copyWithToast } from '@/lib/ui/clipboard';
import { nativeShare } from '@/lib/ui/native-share';
import { buildQuote, commentIssueUrl, pageUrl, textFragmentUrl } from '@/lib/ui/reading-links';
import { showToast } from '@/lib/ui/toast';

const MIN_SELECTION_LENGTH = 3;
const SETTLE_DELAY_MS = 350;
const TOOLBAR_HALF_WIDTH = 140;
const GAP = 10;

type SelectionState = Readonly<{
  isBelow: boolean;
  left: number;
  text: string;
  top: number;
}>;

type SelectionToolbarProps = Readonly<{
  // Id del elemento cuyo texto activa la barra (el artículo).
  targetId: string;
  title: string;
}>;

type ToolbarAction = Readonly<{
  icon: ShareIconName;
  id: string;
  label: string;
  run: () => void;
}>;

function readSelection(targetId: string): SelectionState | null {
  const selection = getSelection();
  const root = document.querySelector(`#${CSS.escape(targetId)}`);

  if (selection === null || root === null || selection.isCollapsed || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const text = selection.toString().trim();

  if (text.length < MIN_SELECTION_LENGTH || !root.contains(range.commonAncestorContainer)) {
    return null;
  }

  const rect = range.getBoundingClientRect();
  const isBelow = rect.top < 80 || matchMedia('(pointer: coarse)').matches;
  const center = rect.left + rect.width / 2;

  return {
    isBelow,
    left: Math.min(
      Math.max(center, TOOLBAR_HALF_WIDTH + GAP),
      innerWidth - TOOLBAR_HALF_WIDTH - GAP,
    ),
    text,
    top: isBelow ? rect.bottom + GAP : rect.top - GAP,
  };
}

function copyAndNotify(value: string, message: string) {
  void copyWithToast(value, () => {
    showToast(message);
  });
}

// Barra flotante sobre el texto seleccionado: copiar, citar, enlazar, compartir y comentar.
export function SelectionToolbar({ targetId, title }: SelectionToolbarProps) {
  const messages = useMessages();
  const [state, setState] = useState<SelectionState | null>(null);
  const frame = useRef(0);

  useEffect(() => {
    let settle: ReturnType<typeof setTimeout> | undefined;

    function update() {
      setState(readSelection(targetId));
    }

    function handleSelectionChange() {
      clearTimeout(settle);

      if (getSelection()?.isCollapsed === true) {
        setState(null);

        return;
      }

      settle = setTimeout(update, SETTLE_DELAY_MS);
    }

    function handleScroll() {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(update);
    }

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', update);
    document.addEventListener('keyup', update);
    addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(settle);
      cancelAnimationFrame(frame.current);
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', update);
      document.removeEventListener('keyup', update);
      removeEventListener('scroll', handleScroll);
    };
  }, [targetId]);

  if (state === null) {
    return null;
  }

  const { selection: labels } = messages;
  const source = { siteName: site.name, title, url: pageUrl(location) };
  const quote = buildQuote(state.text, source);

  const actions: ToolbarAction[] = [
    {
      icon: 'copy',
      id: 'copy',
      label: labels.copy,
      run: () => {
        copyAndNotify(state.text, labels.copied);
      },
    },
    {
      icon: 'quote',
      id: 'quote',
      label: labels.quote,
      run: () => {
        copyAndNotify(quote, labels.quoteCopied);
      },
    },
    {
      icon: 'link',
      id: 'link',
      label: labels.link,
      run: () => {
        copyAndNotify(textFragmentUrl(source.url, state.text), labels.linkCopied);
      },
    },
    {
      icon: 'share',
      id: 'share',
      label: labels.share,
      run: () => {
        if (typeof navigator.share === 'function') {
          void nativeShare({ text: quote, title });
        } else {
          copyAndNotify(quote, labels.quoteCopied);
        }
      },
    },
    {
      icon: 'comment',
      id: 'comment',
      label: labels.comment,
      run: () => {
        open(commentIssueUrl(site.repo, state.text, source), '_blank', 'noopener,noreferrer');
      },
    },
  ];

  return (
    <div
      aria-label={labels.toolbar}
      className="fixed z-50 flex animate-fade items-center gap-0.5 border border-neutral-900 bg-neutral-900 p-1 text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-900"
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      role="toolbar"
      style={{
        left: state.left,
        top: state.top,
        transform: `translate(-50%, ${state.isBelow ? '0' : '-100%'})`,
      }}
    >
      {actions.map((action) => (
        <button
          aria-label={action.label}
          className="inline-flex h-9 w-9 items-center justify-center transition-colors duration-200 hover:bg-white/15 hover:text-accent-300 dark:hover:bg-black/10 dark:hover:text-accent-700"
          key={action.id}
          onClick={action.run}
          title={action.label}
          type="button"
        >
          <ShareIcon name={action.icon} />
        </button>
      ))}
    </div>
  );
}
