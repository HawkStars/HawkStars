'use client';

import i18next from 'i18next';
import { useEffect } from 'react';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getOptions, languages } from './settings';

const runsOnServerSide = typeof window === 'undefined';

// Read the language from the server-rendered <html lang> attribute to avoid
// hydration mismatches. LanguageDetector's `navigator` order would otherwise
// pick the browser locale before useEffect can sync the language.
const getInitialLng = (): string | undefined => {
  if (runsOnServerSide) return undefined;
  return document.documentElement.lang || undefined;
};

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)
    )
  )
  .init({
    ...getOptions(),
    lng: getInitialLng(),
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? languages : [],
  });

export function useTranslation(lng: string, ns: string, options?: Record<string, unknown>) {
  const ret = useTranslationOrg(ns, options);
  const { i18n } = ret;
  if (runsOnServerSide && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng);
  }
  // Called unconditionally to satisfy the Rules of Hooks — effects never run
  // on the server, so this is a no-op there and the branch above handles SSR.
  useEffect(() => {
    if (runsOnServerSide || i18n.resolvedLanguage === lng) return;
    i18n.changeLanguage(lng);
  }, [lng, i18n]);
  return ret;
}
