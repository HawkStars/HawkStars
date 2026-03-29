/**
 *
 *  WEBSITE ROUTES
 * TODO: change this to the dynamic routes
 **/

export const urls = {
  donate: '/contribute',
  contribute: '/contribute',
  artwork: '/artwork',
  history: '/history',
  events: '/events',
  gallery: '/art',
  global_village: '/village',
  global_village_arquitecture: '/village#arquitecture',
  global_village_objectives: '/village#objetives',
  home: '/',
  news: '/news',
  agenda: '/agenda',
  partners: '/partners',
  projects: '/projects',
  transparency: '/transparency',
  team: '/team',
  terms: '/store/terms',
} as const;

export type HawkStarsPaths = keyof typeof urls;
export type HawkStarsUrl = (typeof urls)[HawkStarsPaths];

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
  { url: urls.home, priority: 1 },
  { url: urls.team, priority: 0.5 },
  { url: urls.partners, priority: 0.8 },
  { url: urls.global_village, priority: 1 },
  { url: urls.donate, priority: 1 },
  { url: urls.transparency, priority: 1 },
  { url: urls.history, priority: 0.5 },
  { url: urls.gallery, priority: 0.8 },
  { url: urls.artwork, priority: 0.7 },
  { url: urls.projects, priority: 0.7 },
  { url: urls.agenda, priority: 0.7 },
  { url: urls.news, priority: 0.6 },
  { url: urls.terms, priority: 0.3 },
] as MetadataRoute[];
