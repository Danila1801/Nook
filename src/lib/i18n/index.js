import { en } from './en.js';

const dictionaries = { en };
let activeLocale = 'en';

export function setLocale(locale) {
  if (dictionaries[locale]) activeLocale = locale;
}

export function getLocale() {
  return activeLocale;
}

export function t(key) {
  const dict = dictionaries[activeLocale] || dictionaries.en;
  return key in dict ? dict[key] : key;
}
