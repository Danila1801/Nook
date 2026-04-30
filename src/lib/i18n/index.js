import { en } from './en.js';
import { ru } from './ru.js';
import { ro } from './ro.js';
import { nl } from './nl.js';

const dictionaries = { en, ru, ro, nl };
let activeLocale = 'en';

export function setLocale(locale) {
  if (dictionaries[locale]) activeLocale = locale;
}

export function getLocale() {
  return activeLocale;
}

function lookup(dict, key) {
  const parts = key.split('.');
  let value = dict;
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return undefined;
    }
  }
  return typeof value === 'string' ? value : undefined;
}

export function t(key) {
  const dict = dictionaries[activeLocale] || dictionaries.en;
  const value = lookup(dict, key);
  return value !== undefined ? value : key;
}
