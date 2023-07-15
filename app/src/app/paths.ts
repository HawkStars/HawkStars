export const HOME_URL = "/" as const;
export const ABOUT_US_URL = "/about" as const;
export const TEAM_URL = "/team" as const;
export const PARTNERS_URL = "/partners" as const;

export const DONATE_URL = "/donate" as const;
export const BE_MEMBER_URL = "/be_member" as const;
export const OPORTUNITIES_URL = "/oportunities" as const;

export const goToLanguageRoute = (url: string, lng: string) => {
  return `/${lng}${url}`;
};
