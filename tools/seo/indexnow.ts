import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const key = '29ce51d3c726be0f8b23c1ea9d84275a';
const dist = join(import.meta.dir, '..', '..', 'dist');
const liveRobotsUrl = 'https://sazardev.github.io/software-architecture/robots.txt';
const endpoints = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
  'https://searchadvisor.naver.com/indexnow',
  'https://search.seznam.cz/indexnow',
];

type Submission = { body: string; endpoint: string; ok: boolean; status: number };

type Payload = { host: string; key: string; keyLocation: string; urlList: string[] };

function sitemapUrls(sitemap: string): string[] {
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1])
    .filter((url): url is string => url !== undefined);
}

async function readOptional(path: string): Promise<string | undefined> {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return undefined;
  }
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);

  return response.text();
}

async function readRobots(): Promise<string> {
  return (await readOptional(join(dist, 'robots.txt'))) ?? (await fetchText(liveRobotsUrl));
}

async function submit(endpoint: string, payload: Payload): Promise<Submission> {
  try {
    const response = await fetch(endpoint, {
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      method: 'POST',
    });
    const body = await response.text();

    return { body, endpoint, ok: response.status < 400, status: response.status };
  } catch (error) {
    const body = error instanceof Error ? error.message : String(error);

    return { body, endpoint, ok: false, status: 0 };
  }
}

/**
Notifica a IndexNow las URLs del sitemap en vivo (Bing, Yandex, Naver, Seznam).
La clave vive en `public/<key>.txt` y el workflow lo ejecuta tras cada deploy.
Uso local: `bun run indexnow`.
*/
async function main(): Promise<void> {
  const robots = await readRobots();
  const sitemapUrl = /Sitemap:\s*(\S+)/.exec(robots)?.[1];
  const host = sitemapUrl === undefined ? undefined : new URL(sitemapUrl).host;

  if (sitemapUrl === undefined || host === undefined) {
    throw new Error('No encuentro la URL del sitemap en robots.txt: ejecuta el build o el deploy');
  }

  const urlList = sitemapUrls(await fetchText(sitemapUrl));

  if (urlList.length === 0) {
    throw new Error(`Sitemap vacío en ${sitemapUrl}`);
  }

  const keyLocation = new URL(`${key}.txt`, sitemapUrl).href;
  const payload: Payload = { host, key, keyLocation, urlList };
  const results = await Promise.all(endpoints.map((endpoint) => submit(endpoint, payload)));

  for (const result of results) {
    console.log(
      `${result.ok ? '✔' : '✖'} ${result.endpoint} → ${result.status} ${result.body.slice(0, 120)}`,
    );
  }

  if (results.every((result) => !result.ok)) {
    throw new Error(`Ningún endpoint aceptó las ${urlList.length} URLs`);
  }

  console.log(`✔ IndexNow: ${urlList.length} URLs enviadas desde ${sitemapUrl}`);
}

await main();
