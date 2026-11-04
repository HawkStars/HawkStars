import type { TypedLocale } from 'payload';
import ptCommon from '@/i18n/locales/pt/common.json';
import enCommon from '@/i18n/locales/en/common.json';

type Messages = { [key: string]: string | Messages };

const COMMON: Record<'pt' | 'en', Messages> = { pt: ptCommon, en: enCommon };

const lookup = (messages: Messages, key: string): string | undefined => {
  const value = key
    .split('.')
    .reduce<string | Messages | undefined>(
      (node, part) => (typeof node === 'object' ? node[part] : undefined),
      messages
    );
  return typeof value === 'string' ? value : undefined;
};

/**
 * Default value for a localized text field, taken from the `common` translation
 * files so the copy lives in one place, picked by the locale being edited.
 *
 * A plain string default is written into every locale, so an English default like
 * 'Latest News' ended up as the stored Portuguese heading on the live homepage.
 *
 * Throws while the config loads if the key is missing in either language, so a typo
 * fails the build instead of shipping an empty default.
 */
export const localizedDefault = (key: string) => {
  const pt = lookup(COMMON.pt, key);
  const en = lookup(COMMON.en, key);
  if (pt === undefined || en === undefined) {
    throw new Error(`localizedDefault: "${key}" is missing from i18n/locales/{pt,en}/common.json`);
  }
  // Portuguese is the site's default language, so it is also the fallback.
  return ({ locale }: { locale?: TypedLocale }): string => (locale === 'en' ? en : pt);
};
