'use client';

import { i18CookieName } from '@/i18n/settings';
import { createContext, Dispatch, ReactNode, useContext, useEffect, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';

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
  const [appProperties, setAppProperties] = useState<MainAppProperties>(defaultAppProperties);

  useEffect(() => {
    const i18next = getCookie(i18CookieName);
    if (i18next != lng) setCookie(i18CookieName, lng);
  }, [lng]);

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
