import { site } from '@/lib/config/site';

export function absoluteUrl(path: string): string {
  const base = site.url.endsWith('/') ? site.url.slice(0, -1) : site.url;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  return `${base}/${normalizedPath}`;
}
