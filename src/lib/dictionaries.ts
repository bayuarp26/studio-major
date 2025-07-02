import 'server-only';
import type { Locale } from '../../i18n.config';
import { i18n } from '../../i18n.config';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  id: () => import('@/dictionaries/id.json').then((module) => module.default),
};

export const getDictionary = async (locale?: Locale) => {
  const selectedLocale = locale && i18n.locales.includes(locale)
      ? locale
      : i18n.defaultLocale;
  return dictionaries[selectedLocale]();
};
