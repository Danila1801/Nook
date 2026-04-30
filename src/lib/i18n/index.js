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

function interpolate(template, params) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) => {
    return Object.prototype.hasOwnProperty.call(params, name)
      ? String(params[name])
      : match;
  });
}

export function t(key, params) {
  const dict = dictionaries[activeLocale] || dictionaries.en;
  let value = lookup(dict, key);
  if (value === undefined && activeLocale !== 'en') {
    value = lookup(dictionaries.en, key);
  }
  if (value === undefined) return key;
  return interpolate(value, params);
}
