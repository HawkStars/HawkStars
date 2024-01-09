/**
 *
 *
 *  WEBSITE ROUTES
 *
 *
 **/

export const HOME_URL = '/' as const;
export const ABOUT_US_URL = '/about' as const;
export const TEAM_URL = '/team' as const;
export const PARTNERS_URL = '/partners' as const;
export const HAWK_HISTORY_URL = '/history' as const;

export const DONATE_URL = '/contribute' as const;
export const BE_MEMBER_URL = '/be_member' as const;
export const OPORTUNITIES_URL = '/oportunities' as const;

// global village | training center
export const GLOBAL_VILLAGE_URL = '/village' as const;
export const GLOBAL_VILLAGE_OBJECTIVES = '/village#objetives' as const;
export const GLOBAL_VILLAGE_ARQUITECTURE = '/village#arquitecture' as const;
export const TRANSPARENCY_URL = '/transparency' as const;
export const PINHEL_URL = '/pinhel' as const;

// art gallery
export const GALLERY_URL = '/art' as const;
/**
 *
 * LOGIN
 *
 */
export const OAUTH_CALLBACK_URL = '/auth/callback';

/**
 *
 * EXTERNAL
 *
 **/

export const BE_MEMBER_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdDT_9cnZVkfW_3OjM7RFOpuRHjb4ERvufWtYYv22uo58Bc2w/viewform?fbzx=3306290020571070220' as const;

/**
 *
 *
 * UTILS
 *
 */

export const transformUrl = (lng: string, url: string) => {
  if (!lng) return url;
  return `/${lng}${url}`;
};

/**
 *
 * METADATA
 *
 * */
type MetadataRoute = {
  url: string;
  priority: number;
};

export const routes = [
  { url: HOME_URL, priority: 1 },
  { url: ABOUT_US_URL, priority: 0.5 },
  { url: TEAM_URL, priority: 0.5 },
  { url: PARTNERS_URL, priority: 0.8 },
  { url: GLOBAL_VILLAGE_URL, priority: 1 },
  { url: DONATE_URL, priority: 1 },
  { url: TRANSPARENCY_URL, priority: 1 },
] as MetadataRoute[];
