import * as fs from 'fs';
import { Metadata } from 'next';
import {
  ABOUT_US_URL,
  GLOBAL_VILLAGE_URL,
  HOME_URL,
  PARTNERS_URL,
  TRANSPARENCY_URL,
} from './paths';

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
  let url = pageToUrl[page];
  if (metadataPageInfo) return transformToMetadataObject(metadataPageInfo, lng, url);

  // in case someone forgot to add the metadata information
  metadataPageInfo = JSONFile[defaultPath];
  url = pageToUrl[defaultPath];
  return transformToMetadataObject(metadataPageInfo, lng, url);
};

const transformToMetadataObject = (info: any, lng: string, url: string): Metadata => {
  const { title, description, keywords } = info;
  return {
    title: title,
    description: description,
    keywords: keywords,
    referrer: 'no-referrer-when-downgrade',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/${lng}${url}`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_APP_URL}/en${url}`,
        pt: `${process.env.NEXT_PUBLIC_APP_URL}/pt${url}`,
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${lng}`,
    },
  } as Metadata;
};

const pageToUrl = {
  about: ABOUT_US_URL,
  partners: PARTNERS_URL,
  transparency: TRANSPARENCY_URL,
  village: GLOBAL_VILLAGE_URL,
  home: HOME_URL,
} as { [x: string]: string };

export { getMetadataPageInfo };
