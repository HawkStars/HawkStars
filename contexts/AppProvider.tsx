'use client';

import { fallbackLng, i18CookieName } from '@/i18n/settings';
import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { createContext, Dispatch, ReactNode, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

type MainAppProperties = {
  mobileNavbarOpen: boolean;
};

const defaultAppProperties: MainAppProperties = {
  mobileNavbarOpen: false,
};

const MainAppContext = createContext<MainAppProperties>(defaultAppProperties);
const SetMainAppContext = createContext<Dispatch<MainAppProperties>>(() => {});

type AppProviderProps = {
  children: ReactNode;
  lng: string;
};

const AppProvider = ({ children, lng }: AppProviderProps) => {
  const [cookie, setCookie] = useCookies([i18CookieName]);
  const [appProperties, setAppProperties] = useState<MainAppProperties>(defaultAppProperties);

  useEffect(() => {
    if (cookie.i18next != lng) setCookie(i18CookieName, lng);
  }, [lng, cookie.i18next, setCookie]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.onAuthStateChange;
  }, []);

  return (
    <MainAppContext.Provider value={appProperties}>
      <SetMainAppContext.Provider value={setAppProperties}>{children}</SetMainAppContext.Provider>
    </MainAppContext.Provider>
  );
};

export const useMainAppContext = () => {
  return useContext(MainAppContext);
};

export const useSetMainProperties = () => {
  const setMainProperties = useContext(SetMainAppContext);
  return (value: MainAppProperties) => {
    setMainProperties(value);
  };
};

export const useSetMobileNavbarOpen = () => {
  const mainProperties = useContext(MainAppContext);
  const setMainProperties = useContext(SetMainAppContext);
  return (value: boolean) => {
    setMainProperties({
      ...mainProperties,
      mobileNavbarOpen: value,
    });
  };
};

export default AppProvider;
