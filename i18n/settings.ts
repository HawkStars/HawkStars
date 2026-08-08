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

// BCP-47 tags for native Intl APIs (toLocaleDateString/toLocaleString).
// Our `Language` values ('pt' / 'en') are app-level route/i18next codes, not
// necessarily valid on their own for every Intl call site — and a value that
// isn't one of the two above (e.g. from a malformed Accept-Language header)
// must never reach Intl directly, since an invalid tag throws
// `RangeError: Incorrect locale information provided`. Always resolve
// through this helper instead of passing `lng` straight into toLocale*.
const intlLocales: Record<Language, string> = { pt: 'pt-PT', en: 'en-US' };

function toIntlLocale(lng?: string | null): string {
  return intlLocales[lng as Language] ?? intlLocales[fallbackLng];
}

export { fallbackLng, languages, defaultNS, i18CookieName, getOptions, i18nConfig, toIntlLocale };
