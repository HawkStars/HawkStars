'use client';
import { fallbackLng, i18CookieName } from '@/i18n/settings';
import { useCookies } from 'react-cookie';

export function useLanguageCookie() {
  const [cookies] = useCookies([i18CookieName]);

  return cookies.i18next || fallbackLng;
}
