import { en } from './en';

type TranslationKey = string;

export function t(key: TranslationKey): string {
  const keys = key.split('.');
  let value: any = en;

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) return key;
  }

  return typeof value === 'string' ? value : key;
}

export { en };
