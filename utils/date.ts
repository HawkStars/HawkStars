import { toIntlLocale } from '@/i18n/settings';

/**
 * Every date on the site is shown in the NGO's own time zone.
 *
 * Without a fixed zone, a server-rendered date and the same date re-rendered in the
 * visitor's browser can land on different days — "2026-07-09T23:30:00Z" is 10 July in
 * Lisbon but 9 July in São Paulo — and React reports a hydration mismatch. It also
 * makes plain dates ("2026-07-10", parsed as UTC midnight) show as the day before
 * anywhere west of UTC.
 */
export const SITE_TIME_ZONE = 'Europe/Lisbon';

/** "10 de julho de 2026" / "July 10, 2026". */
export const LONG_DATE: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
};

type DateInput = string | Date | null | undefined;

const toDate = (value: DateInput): Date | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatter = (lng: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(toIntlLocale(lng), { timeZone: SITE_TIME_ZONE, ...options });

/**
 * A date for display, in the page's language and the site's time zone.
 * Accepts the ISO strings Payload returns ("2026-07-10T12:00:00.000Z") or a Date.
 * Returns '' for a missing or unparseable value, so callers never print "Invalid Date".
 */
export const formatDate = (
  value: DateInput,
  lng: string,
  options: Intl.DateTimeFormatOptions = LONG_DATE
): string => {
  const date = toDate(value);
  return date ? formatter(lng, options).format(date) : '';
};

/**
 * A date range, collapsed the way the language does it:
 * "10–12 de julho de 2026", "30 de julho – 2 de agosto de 2026", "July 10 – 12, 2026".
 * Falls back to a single date when there is no end, or it is the same day.
 */
export const formatDateRange = (
  start: DateInput,
  end: DateInput,
  lng: string,
  options: Intl.DateTimeFormatOptions = LONG_DATE
): string => {
  const from = toDate(start);
  const to = toDate(end);
  if (!from) return '';
  if (!to || to <= from) return formatDate(from, lng, options);

  const fmt = formatter(lng, options);
  if (fmt.format(from) === fmt.format(to)) return fmt.format(from);
  // Node's ICU puts thin spaces (U+2009) around the range dash where browsers use plain
  // spaces, so a server-rendered range would not match the hydrated one.
  return fmt.formatRange(from, to).replace(/[\u2009\u202f]/g, ' ');
};
