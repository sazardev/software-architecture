import { useLocale } from '@/lib/i18n/locale-context';
import { getMessages, type Messages } from '@/lib/i18n/messages';

export function useMessages(): Messages {
  return getMessages(useLocale());
}
