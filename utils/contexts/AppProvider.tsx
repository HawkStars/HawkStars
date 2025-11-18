'use client';

import { fallbackLng, Language } from '@/i18n/settings';
import { Footer, Header } from '@/payload-types';
import { createContext, Dispatch, ReactNode, useContext, useState } from 'react';

type MainAppProperties = {
  mobileNavbarOpen: boolean;
  lng: Language;
  headerInfo?: Header;
  footerInfo?: Footer;
};

const defaultAppProperties: MainAppProperties = {
  mobileNavbarOpen: false,
  lng: fallbackLng,
};

const MainAppContext = createContext<MainAppProperties>(defaultAppProperties);
const SetMainAppContext = createContext<Dispatch<MainAppProperties>>(() => {});

type AppProviderProps = {
  children: ReactNode;
  lng: Language;
  headerInfo?: Header;
  footerInfo?: Footer;
};

const AppProvider = ({ children, lng, headerInfo, footerInfo }: AppProviderProps) => {
  const [appProperties, setAppProperties] = useState<MainAppProperties>({
    ...defaultAppProperties,
    lng,
    headerInfo,
    footerInfo,
  });

  return (
    <MainAppContext.Provider value={appProperties}>
      <SetMainAppContext.Provider value={setAppProperties}>{children}</SetMainAppContext.Provider>
    </MainAppContext.Provider>
  );
};

export const useMainAppContext = () => {
  return useContext(MainAppContext);
};

/** SETTERS */

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

export const useSetLanguageCookie = () => {
  const mainProperties = useContext(MainAppContext);
  const setMainProperties = useContext(SetMainAppContext);
  return (newLng: Language) => {
    setMainProperties({
      ...mainProperties,
      lng: newLng,
    });
  };
};

/** GETTERS */

export const useLanguageCookie = () => {
  const mainProperties = useContext(MainAppContext);
  return mainProperties.lng;
};

export const useHeaderInfo = () => {
  const mainProperties = useContext(MainAppContext);
  return mainProperties.headerInfo;
};

export const useFooterInfo = () => {
  const mainProperties = useContext(MainAppContext);
  return mainProperties.footerInfo;
};

export default AppProvider;
