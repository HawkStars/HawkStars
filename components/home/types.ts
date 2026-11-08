import type { Language } from '@/i18n/settings';

export type HomeT = (key: string) => string;

export type HomeSectionProps = {
  t: HomeT;
  lng: Language;
};
