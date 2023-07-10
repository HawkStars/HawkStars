"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useState,
} from "react";

type MainAppProperties = {
  mobileNavbarOpen: boolean;
};

const defaultAppProperties: MainAppProperties = {
  mobileNavbarOpen: false,
};

const MainAppContext = createContext<MainAppProperties>(defaultAppProperties);
const SetMainAppContext = createContext<Dispatch<MainAppProperties>>(() => {});

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appProperties, setAppProperties] =
    useState<MainAppProperties>(defaultAppProperties);

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
  const setMainProperties = useContext(SetMainAppContext);
  return (value: boolean) => {
    setMainProperties({ mobileNavbarOpen: value });
  };
};

export default AppProvider;
