type MetadataRoute = {
  url: string;
  priority: number;
};

export const routes = [
  { url: '/', priority: 1 },
  { url: '/about', priority: 0.5 },
  { url: '/team', priority: 0.5 },
  { url: '/partners', priority: 0.8 },
  { url: '/village', priority: 1 },
] as MetadataRoute[];

export const PROD_URL = 'https://hawkstars.org/';

/**
 *  INTERNAL
 * */

export const HOME_URL = '/' as const;
export const ABOUT_US_URL = '/about' as const;
export const TEAM_URL = '/team' as const;
export const PARTNERS_URL = '/partners' as const;

export const DONATE_URL = '/donate' as const;
export const BE_MEMBER_URL = '/be_member' as const;
export const OPORTUNITIES_URL = '/oportunities' as const;

export const GLOBAL_VILLAGE_URL = '/village' as const;
export const GLOBAL_VILLAGE_OBJECTIVES = '/village#objetives' as const;
export const GLOBAL_VILLAGE_ARQUITECTURE = '/village#arquitecture' as const;

// login
export const OAUTH_CALLBACK_URL = '/auth/callback';

/* EXTERNAL */

export const BE_MEMBER_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdDT_9cnZVkfW_3OjM7RFOpuRHjb4ERvufWtYYv22uo58Bc2w/viewform?fbzx=3306290020571070220' as const;

/* UTILS */
export const transformUrl = (lng: string, url: string) => {
  if (!lng) return url;
  return `/${lng}${url}`;
};
