import { site } from '@/lib/config/site';

const formatter = new Intl.DateTimeFormat(site.locale, { dateStyle: 'medium' });

export function formatDate(isoDate: string): string {
  return formatter.format(new Date(`${isoDate}T00:00:00`));
}
