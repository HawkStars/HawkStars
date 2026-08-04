'use client';

import { fallbackLng, Language } from '@/i18n/settings';
import { NavbarVariant, DEFAULT_NAVBAR_VARIANT } from '@/lib/constants';
import { Footer, Header } from '@/payload-types';
import { createContext, Dispatch, ReactNode, useContext, useState } from 'react';

type MainAppProperties = {
  mobileNavbarOpen: boolean;
  lng: Language;
  navbarVariant: NavbarVariant;
};

const defaultAppProperties: MainAppProperties = {
  mobileNavbarOpen: false,
  lng: fallbackLng,
  navbarVariant: DEFAULT_NAVBAR_VARIANT,
};

const MainAppContext = createContext<MainAppProperties>(defaultAppProperties);
const SetMainAppContext = createContext<Dispatch<React.SetStateAction<MainAppProperties>>>(
  () => {}
);

type AppProviderProps = {
  children: ReactNode;
  lng: Language;
};

const AppProvider = ({ children, lng }: AppProviderProps) => {
  const [appProperties, setAppProperties] = useState<MainAppProperties>({
    ...defaultAppProperties,
    lng,
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

export const useSetMobileNavbarOpen = () => {
  const setMainProperties = useContext(SetMainAppContext);
  return (value: boolean) => {
    setMainProperties(
      (mainProperties: MainAppProperties) =>
        ({
          ...mainProperties,
          mobileNavbarOpen: value,
        }) as MainAppProperties
    );
  };
};

export const useSetLanguageCookie = () => {
  const setMainProperties = useContext(SetMainAppContext);
  return (newLng: Language) => {
    setMainProperties((mainProperties: MainAppProperties) => ({
      ...mainProperties,
      lng: newLng,
    }));
  };
};

export const useSetNavbarVariant = () => {
  const setMainProperties = useContext(SetMainAppContext);
  return (variant: NavbarVariant) => {
    setMainProperties((mainProperties: MainAppProperties) => ({
      ...mainProperties,
      navbarVariant: variant,
    }));
  };
};

/** GETTERS */

export const useLanguageCookie = () => {
  const mainProperties = useContext(MainAppContext);
  return mainProperties.lng;
};

export default AppProvider;
