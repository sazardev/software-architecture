import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const key = '95f9e3264112509f5838fc7a31c039c5';
const dist = join(import.meta.dir, '..', '..', 'dist');

function sitemapUrls(sitemap: string): string[] {
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1])
    .filter((url): url is string => url !== undefined);
}

/**
Notifica a IndexNow (Bing, Yandex, Naver, Seznam) todas las URLs del sitemap generado.
Uso: `bun run build && bun run indexnow`. La clave vive en `public/<key>.txt`.
*/
async function main(): Promise<void> {
  const [sitemap, robots] = await Promise.all([
    readFile(join(dist, 'sitemap.xml'), 'utf8'),
    readFile(join(dist, 'robots.txt'), 'utf8'),
  ]);
  const urls = sitemapUrls(sitemap);
  const sitemapUrl = /Sitemap:\s*(\S+)/.exec(robots)?.[1];
  const host = sitemapUrl === undefined ? undefined : new URL(sitemapUrl).host;

  if (sitemapUrl === undefined || host === undefined || urls.length === 0) {
    throw new Error(
      'Falta dist/sitemap.xml o su URL en robots.txt: ejecuta "bun run build" primero',
    );
  }

  const keyLocation = new URL(`${key}.txt`, sitemapUrl).href;
  const response = await fetch('https://api.indexnow.org/indexnow', {
    body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    method: 'POST',
  });

  if (response.status >= 400) {
    throw new Error(`IndexNow respondió ${response.status}: ${await response.text()}`);
  }

  console.log(`✔ IndexNow: ${urls.length} URLs enviadas a Bing/Yandex/Seznam (${response.status})`);
}

await main();
