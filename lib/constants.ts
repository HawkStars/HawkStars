/**
 * Single source of truth for site-wide constants.
 *
 * Every file that needs the production URL, OG image path, or site
 * identity strings should import from here — never hard-code them.
 */

/** Canonical base URL (no trailing slash). */
export const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://hawkstars.org';

/** Localhost fallback used only by server-side Payload utilities. */
export const BASE_URL_DEV = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

/** Default OpenGraph / Twitter share image (1200 × 630 recommended). */
// TODO: Replace with a dedicated 1200×630 OG image when available
export const OG_IMAGE_FALLBACK = `${BASE_URL}/images/hero.png`;

/** Organisation identity */
export const SITE_NAME = 'Hawk Stars NGO';
export const SITE_NAME_FULL = 'Associação HawkStars';
export const SITE_LOCALE_PT = 'pt_PT';
export const SITE_LOCALE_EN = 'en_US';

/** Google Analytics */
export const GA_MEASUREMENT_ID = 'G-PEH83S3H3K';
