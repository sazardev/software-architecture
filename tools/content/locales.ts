import { join } from 'node:path';

type LocaleDefinition = {
  code: string;
  label: string;
  ogLocale: string;
};

type LocalesConfig = {
  default: string;
  locales: LocaleDefinition[];
};

const localesFile = join(import.meta.dir, '..', '..', 'src', 'lib', 'i18n', 'locales.json');

export const localesConfig = JSON.parse(await Bun.file(localesFile).text()) as LocalesConfig;
export const locales: string[] = localesConfig.locales.map((definition) => definition.code);
export const defaultLocale: string = localesConfig.default;

export function isLocale(value: string): boolean {
  return locales.includes(value);
}
