import * as fs from 'fs';
import * as Sentry from '@sentry/nextjs';
import { Metadata } from 'next/types';

import { Language, fallbackLng, languages } from '@/i18n/settings';
import { HawkStarsPaths, urls } from './paths';
import { Media } from '@/payload-types';

export const defaultMetadata = {
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
} as Metadata;

const readMetadataLanguageFile = (lng: Language) => {
  try {
    const file = fs.readFileSync(`./i18n/locales/${lng}/metadata.json`, 'utf-8');

    return JSON.parse(file);
  } catch (err) {
    console.error('Error reading metadata file for language:', lng, err);
    return undefined;
  }
};

const prepareMetadataInfo = ({
  title,
  description,
}: {
  title?: string | null;
  description?: string | null;
  image?: string | Media | null;
}): Metadata => {
  // TODO: missing the image
  return {
    title,
    description,
    icons: {
      icon: 'public/images/logos/logo.webp',
      shortcut: 'public/images/logos/logo.webp',
    },
    openGraph: {
      title: title || '',
      description: description || '',
      siteName: 'Hawk Stars NGO',
    },
  };
};

const getMetadataPageInfo = (lng: Language, page: HawkStarsPaths): Metadata => {
  const defaultPath = 'home' as HawkStarsPaths;
  if (!languages.includes(lng)) {
    lng = fallbackLng;
  }
  const JSONFile = readMetadataLanguageFile(lng);
  try {
    const metadataPageInfo = JSONFile[page];
    const url = urls[page] || urls[defaultPath];
    return transformToMetadataObject(metadataPageInfo, lng, url);
  } catch (err) {
    console.error(err, lng, page);
    return {
      title: 'The Global Village Project by Hawk Stars NGO in Pinhel, Portugal',
      description:
        "Discover Hawk Stars NGO's visionary Global Village project in Pinhel, Portugal. Join us in redefining urban landscapes, fostering innovation building a promising future.",
    };
  }
};

const transformToMetadataObject = (
  info: { title: string; description: string; keywords: string[] },
  lng: Language,
  url: string
): Metadata => {
  const { title, description, keywords } = info || { title: '', description: '', keyords: '' };
  if (title == '' || description == '')
    Sentry.captureMessage(`${url} is missing metadata`, { extra: { url, lng } });

  if (url === '/') url = '';

  return {
    title: title,
    description: description,
    keywords: keywords,
    referrer: 'no-referrer-when-downgrade',
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
    alternates: {
      languages: {
        en: `/en${url}`,
        pt: `/pt${url}`,
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

export { getMetadataPageInfo, prepareMetadataInfo };
