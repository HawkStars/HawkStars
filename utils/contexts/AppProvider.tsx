'use client';

import { fallbackLng, Language } from '@/i18n/settings';
import { NavbarVariant, DEFAULT_NAVBAR_VARIANT } from '@/lib/constants';
import { createContext, Dispatch, ReactNode, useContext, useMemo, useState } from 'react';

type MainAppProperties = {
  mobileNavbarOpen: boolean;
  lng: Language;
  navbarVariant: NavbarVariant;
};

// `lng` is deliberately NOT part of the mutable state — see AppProvider below.
type MutableAppProperties = Omit<MainAppProperties, 'lng'>;

const defaultMutableProperties: MutableAppProperties = {
  mobileNavbarOpen: false,
  navbarVariant: DEFAULT_NAVBAR_VARIANT,
};

// Components rendered outside an <AppProvider> (Storybook stories, the Payload
// admin live preview) still call the getters below, so the context keeps a
// usable default rather than throwing. Inside the app the provider always wins.
const MainAppContext = createContext<MainAppProperties>({
  ...defaultMutableProperties,
  lng: fallbackLng,
});
const SetMainAppContext = createContext<Dispatch<React.SetStateAction<MutableAppProperties>>>(
  () => {}
);

type AppProviderProps = {
  children: ReactNode;
  lng: Language;
};

const AppProvider = ({ children, lng }: AppProviderProps) => {
  const [appProperties, setAppProperties] =
    useState<MutableAppProperties>(defaultMutableProperties);

  // The current language is owned by the route (`app/[lng]/...`), so it is read
  // straight off the prop instead of being copied into state. The copy was a
  // second source of truth that could not stay in sync: `useState`'s initial
  // value is only evaluated on mount, and navigating /pt -> /en reuses this
  // same layout instance, so the context kept serving the old locale while the
  // rest of the tree already had the new one. `useTranslation` then had two
  // different languages to satisfy in one tree and flipped between them until
  // React gave up with "Maximum update depth exceeded".
  const value = useMemo<MainAppProperties>(() => ({ ...appProperties, lng }), [appProperties, lng]);

  return (
    <MainAppContext.Provider value={value}>
      <SetMainAppContext.Provider value={setAppProperties}>{children}</SetMainAppContext.Provider>
    </MainAppContext.Provider>
  );
};

export const useMainAppContext = (): MainAppProperties => {
  return useContext(MainAppContext);
};

/** SETTERS */

export const useSetMobileNavbarOpen = () => {
  const setMainProperties = useContext(SetMainAppContext);
  return (value: boolean) => {
    setMainProperties((mainProperties) => ({
      ...mainProperties,
      mobileNavbarOpen: value,
    }));
  };
};

export const useSetNavbarVariant = () => {
  const setMainProperties = useContext(SetMainAppContext);
  return (variant: NavbarVariant) => {
    setMainProperties((mainProperties) => ({
      ...mainProperties,
      navbarVariant: variant,
    }));
  };
};

/** GETTERS */

export const useLanguageCookie = () => {
  return useMainAppContext().lng;
};

export default AppProvider;
