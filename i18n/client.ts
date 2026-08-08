'use client';

import i18next from 'i18next';
import { useEffect, useRef } from 'react';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getOptions, languages, type Language } from './settings';

const runsOnServerSide = typeof window === 'undefined';

const isSupportedLng = (lng: string | null | undefined): lng is Language =>
  !!lng && (languages as readonly string[]).includes(lng);

// Read the language from the server-rendered <html lang> attribute to avoid
// hydration mismatches. LanguageDetector's `navigator` order would otherwise
// pick the browser locale before useEffect can sync the language.
const getInitialLng = (): string | undefined => {
  if (runsOnServerSide) return undefined;
  const lng = document.documentElement.lang;
  return isSupportedLng(lng) ? lng : undefined;
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

  // Last language THIS hook instance asked for. react-i18next suspends while a
  // namespace loads for the incoming language, and a suspended subtree has its
  // effects torn down and re-run on reveal — so the effect below cannot rely on
  // its dependency array alone to run once per `lng`. The ref survives that
  // teardown (React preserves state/refs across suspense) and is what actually
  // makes the call idempotent.
  const requestedLng = useRef<string | null>(null);

  // Called unconditionally to satisfy the Rules of Hooks — effects never run
  // on the server, so this is a no-op there and the branch above handles SSR.
  useEffect(() => {
    if (runsOnServerSide) return;

    // `changeLanguage` runs its argument through `getBestMatchFromCodes`, so a
    // code outside `supportedLngs` silently settles on `fallbackLng`. Asking for
    // one means `resolvedLanguage` can never equal `lng`, the guard below stays
    // false forever, and every remount fires another pointless change.
    if (!isSupportedLng(lng)) return;

    // Compare against the language that was REQUESTED, not the one i18next
    // settled on: `resolvedLanguage` is only ever assigned a code that already
    // has translations in the store, so mid-load it can still be `undefined` or
    // the fallback even though the switch to `lng` has already happened.
    if (i18n.language === lng) return;

    // Two hook instances holding different `lng` values (a stale context value
    // next to the route param, say) would otherwise flip the language back and
    // forth on every suspense-driven remount — the "Maximum update depth
    // exceeded" loop. One request per language per instance, and it settles.
    if (requestedLng.current === lng) return;

    requestedLng.current = lng;
    i18n.changeLanguage(lng);
  }, [lng, i18n]);
  return ret;
}
