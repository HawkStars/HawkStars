/**
 *
 *  WEBSITE ROUTES
 * TODO: change this to the dynamic routes
 **/

export const SITE_GET_URLS = {
  contribute: '/contribute',
  artwork: '/artwork',
  history: '/history',
  events: '/events',
  events_archive: '/events/archive',
  gallery: '/art',
  home: '/',
  news: '/news',
  agenda: '/agenda',
  partners: '/partners',
  projects: '/projects',
  projects_archive: '/projects/archive',
  erasmus: '/erasmus',
  erasmus_key_action: '/erasmus/key-action',
  how_to_help_us: '/how-to-help-us',
  members_corner: '/members-corner',
  transparency: '/transparency',
  team: '/team',
  terms: '/store/terms',
} as const;

export const allUrls = {
  ...SITE_GET_URLS,
  members_corner_submit: '/members-corner/submit',
};

export type HawkStarsPaths = keyof typeof SITE_GET_URLS;

/**
 *
 * EXTERNAL
 *
 **/

/**
 *
 *
 * UTILS
 *
 */

export const transformUrl = (
  lng: string,
  url: string,
  searchParams?: { [key: string]: string | number }
) => {
  if (!lng) return url;

  const link = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/${lng}${url}`);
  if (!searchParams) return link.pathname;

  for (const [param, value] of Object.entries(searchParams)) {
    link.searchParams.append(param, String(value));
  }

  return link.pathname + link.search;
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
  { url: SITE_GET_URLS.home, priority: 1 },
  { url: SITE_GET_URLS.team, priority: 0.5 },
  { url: SITE_GET_URLS.partners, priority: 0.8 },
  { url: SITE_GET_URLS.contribute, priority: 1 },
  { url: SITE_GET_URLS.transparency, priority: 1 },
  { url: SITE_GET_URLS.history, priority: 0.5 },
  { url: SITE_GET_URLS.gallery, priority: 0.8 },
  { url: SITE_GET_URLS.artwork, priority: 0.7 },
  { url: SITE_GET_URLS.projects, priority: 0.7 },
  { url: SITE_GET_URLS.projects_archive, priority: 0.4 },
  { url: SITE_GET_URLS.events, priority: 0.7 },
  { url: SITE_GET_URLS.events_archive, priority: 0.4 },
  { url: SITE_GET_URLS.erasmus, priority: 0.7 },
  { url: SITE_GET_URLS.erasmus_key_action, priority: 0.6 },
  { url: SITE_GET_URLS.how_to_help_us, priority: 0.8 },
  { url: SITE_GET_URLS.members_corner, priority: 0.7 },
  { url: SITE_GET_URLS.agenda, priority: 0.7 },
  { url: SITE_GET_URLS.news, priority: 0.6 },
  { url: SITE_GET_URLS.terms, priority: 0.3 },
] as MetadataRoute[];

// z.url() alone accepts schemes like javascript:, data: and vbscript:, which
// become a stored-XSS vector once these URLs are rendered (img src / iframe /
// anchor href) after an admin confirms the submission. Restrict to http(s).
export const isHttpUrl = (value: string) => {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};
