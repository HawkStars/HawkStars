'use client';

import { NavbarVariant, DEFAULT_NAVBAR_VARIANT } from '@/components/navbar/NavbarVariant';
import { fallbackLng, Language } from '@/i18n/settings';
import { Footer, Header } from '@/payload-types';
import { createContext, Dispatch, ReactNode, useContext, useEffect, useState } from 'react';

type MainAppProperties = {
  mobileNavbarOpen: boolean;
  lng: Language;
  headerInfo?: Header;
  footerInfo?: Footer;
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

  useEffect(() => {
    setAppProperties((prev) => ({
      ...prev,
      lng,
      headerInfo,
      footerInfo,
    }));
  }, [lng, headerInfo, footerInfo]);

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

export const useHeaderInfo = () => {
  const mainProperties = useContext(MainAppContext);
  return mainProperties.headerInfo;
};

export const useFooterInfo = () => {
  const mainProperties = useContext(MainAppContext);
  return mainProperties.footerInfo;
};

export const useNavbarVariant = () => {
  const mainProperties = useContext(MainAppContext);
  return mainProperties.navbarVariant;
};

export default AppProvider;
