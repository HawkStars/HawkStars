/**
 * Single source of truth for site-wide constants.
 *
 * Every file that needs the production URL, OG image path, or site
 * identity strings should import from here — never hard-code them.
 */

/** Canonical base URL (no trailing slash). */
export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://hawkstars.org';

/**
 * Default OpenGraph / Twitter share image: the Hawk Stars lockup centred on
 * the brand beige, rendered at exactly 1200 × 630 and flattened (no alpha, so
 * platforms that composite on black don't lose the black wing and wordmark).
 * Used whenever a page or CMS document has no image of its own.
 */
export const OG_IMAGE_FALLBACK = `${BASE_URL}/images/og-default.png`;

/** Intrinsic size of OG_IMAGE_FALLBACK — keep in sync with the asset. */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** Organisation identity */
export const SITE_NAME = 'Hawk Stars NGO';
export const SITE_LOCALE_PT = 'pt_PT';
export const SITE_LOCALE_EN = 'en_US';

/** Google Analytics */
export const GA_MEASUREMENT_ID = 'G-PEH83S3H3K';

/** FLAG */
export const FLAG_PORTUGAL = 'Portugal';

/** Navbar Variant */
export type NavbarVariant = 'default' | 'erasmus';
export const DEFAULT_NAVBAR_VARIANT: NavbarVariant = 'default';
