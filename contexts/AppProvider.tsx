'use client';

import { fallbackLng } from '../i18n/settings';
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useState,
} from 'react';

type MainAppProperties = {
  mobileNavbarOpen: boolean;
  lng: string;
};

const defaultAppProperties: MainAppProperties = {
  mobileNavbarOpen: false,
  lng: fallbackLng,
};

const MainAppContext = createContext<MainAppProperties>(defaultAppProperties);
const SetMainAppContext = createContext<Dispatch<MainAppProperties>>(() => {});

const AppProvider = ({
  lng,
  children,
}: {
  lng: string;
  children: ReactNode;
}) => {
  const [appProperties, setAppProperties] = useState<MainAppProperties>({
    ...defaultAppProperties,
    lng: lng || fallbackLng,
  });

  return (
    <MainAppContext.Provider value={appProperties}>
      <SetMainAppContext.Provider value={setAppProperties}>
        {children}
      </SetMainAppContext.Provider>
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

export const useSetLanguageOnApp = () => {
  const appProperties = useContext(MainAppContext);
  const setMainProperties = useContext(SetMainAppContext);
  return (lng: string) => {
    setMainProperties({
      ...appProperties,
      lng,
    });
  };
};

export default AppProvider;
