import { languages } from '@/i18n/settings';
import * as fs from 'fs';
import { Metadata } from 'next';

export type HawkStarsPath = 'partners' | 'transparency' | 'village' | 'home' | 'about';

export const defaultMetadata = {
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
} as Metadata;

const readMetadataLanguageFile = (lng: string) => {
  try {
    const file = fs.readFileSync(`./i18n/locales/${lng}/metadata.json`, 'utf-8');

    return JSON.parse(file);
  } catch (err) {
    return undefined;
  }
};

const getMetadataPageInfo = (lng: string, page: HawkStarsPath): Metadata => {
  const defaultPath = 'home' as HawkStarsPath;
  const JSONFile = readMetadataLanguageFile(lng);

  let metadataPageInfo = JSONFile[page];
  if (metadataPageInfo) return transformToMetadataObject(metadataPageInfo, lng);

  // in case someone forgot to add the metadata information
  metadataPageInfo = JSONFile[defaultPath];
  return transformToMetadataObject(metadataPageInfo, lng);
};

const transformToMetadataObject = (info: any, lng: string): Metadata => {
  return {
    title: info.title,
    description: info.description,
    keywords: info.keywords,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/${lng}`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_APP_URL}/en`,
        pt: `${process.env.NEXT_PUBLIC_APP_URL}/pt`,
      },
    },
  } as Metadata;
};

export { getMetadataPageInfo };
