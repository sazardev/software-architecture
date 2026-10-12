import { Eyebrow } from '@/components/atoms';
import { ShareActions } from '@/components/molecules';
import { site } from '@/lib/config/site';
import type { ContentEntry } from '@/lib/content/types';
import { useMessages } from '@/lib/i18n/use-messages';
import { editUrl } from '@/lib/ui/reading-links';

type ArticleFooterProps = Readonly<{
  entry: ContentEntry;
}>;

const linkClass =
  'link-underline pb-0.5 font-sans text-sm font-medium text-brand-700 dark:text-brand-300';

/**
Cierre del artículo: compartir, sugerir cambios y volver arriba.
*/
export function ArticleFooter({ entry }: ArticleFooterProps) {
  const messages = useMessages();

  return (
    <footer className="mt-16 space-y-6 border-t border-neutral-300 pt-8 dark:border-neutral-700">
      <Eyebrow>{messages.article.shareCta}</Eyebrow>
      <ShareActions layout="row" title={entry.title} />
      <p className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <a
          className={linkClass}
          href={editUrl(site.repo, entry.locale, entry.slug)}
          rel="noopener noreferrer"
          target="_blank"
        >
          {messages.article.editOnGitHub} ↗
        </a>
        <a className={linkClass} href="#contenido">
          {messages.a11y.backToTop} ↑
        </a>
      </p>
    </footer>
  );
}
