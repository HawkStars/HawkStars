export const fallbackLng = 'pt';
export const languages = [fallbackLng, 'en'] as const;
export const defaultNS = 'common';
export const i18CookieName = 'i18next';

export type Language = (typeof languages)[number];

export function getOptions(lng = fallbackLng, ns: string | string[] = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}

export const i18nConfig = {
  locales: languages,
  defaultLocale: fallbackLng,
};
