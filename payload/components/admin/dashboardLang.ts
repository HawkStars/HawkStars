/**
 * The two admin UI languages (`i18n.supportedLanguages` in payload.config.ts).
 * Kept dependency-free: it is imported by both the server dashboard and the
 * client dashboard widgets.
 */
export type DashboardLang = 'pt' | 'en';

export const toDashboardLang = (language: string | undefined): DashboardLang =>
  language === 'en' ? 'en' : 'pt';
