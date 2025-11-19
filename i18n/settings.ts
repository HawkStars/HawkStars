const fallbackLng = 'pt';
const languages = [fallbackLng, 'en'] as const;
const defaultNS = 'common' as const;
const i18CookieName = 'i18next' as const;

export type Language = (typeof languages)[number];

function getOptions(lng = fallbackLng, ns: string | string[] = defaultNS) {
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

const i18nConfig = {
  locales: languages,
  defaultLocale: fallbackLng,
};

export { fallbackLng, languages, defaultNS, i18CookieName, getOptions, i18nConfig };
