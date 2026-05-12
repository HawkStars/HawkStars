import * as fs from 'fs';
import * as Sentry from '@sentry/nextjs';
import { Metadata } from 'next/types';

import { Language, fallbackLng, languages } from '@/i18n/settings';
import { HawkStarsPaths, urls } from './paths';
import { Media } from '@/payload-types';
import {
  BASE_URL,
  OG_IMAGE_FALLBACK,
  SITE_NAME,
  SITE_LOCALE_PT,
  SITE_LOCALE_EN,
} from '@/lib/constants';

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
  image,
}: {
  title?: string | null;
  description?: string | null;
  image?: string | Media | null;
}): Metadata => {
  const ogImage =
    typeof image === 'string'
      ? image
      : image && typeof image === 'object' && 'url' in image
        ? (image as Media).url || OG_IMAGE_FALLBACK
        : OG_IMAGE_FALLBACK;

  return {
    title,
    description,
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/favicon.ico',
    },
    openGraph: {
      title: title || '',
      description: description || '',
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title || SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: title || '',
      description: description || '',
      images: [ogImage],
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
  const { title, description, keywords } = info || {};
  if (!title || !description) {
    // Defer Sentry logging to avoid crypto.randomUUID() during static prerendering
    // See: https://nextjs.org/docs/messages/next-prerender-crypto
    setTimeout(() => {
      Sentry.captureMessage(`${url} is missing metadata`, { extra: { url, lng } });
    }, 0);
  }

  if (url === '/') url = '';

  const canonicalUrl = `${BASE_URL}/${lng}${url}`;

  return {
    title,
    description,
    keywords,
    authors: [
      {
        name: 'Paulo Cardoso',
        url: 'https://www.linkedin.com/in/pcardosolei/',
      },
    ],
    appleWebApp: false,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE_FALLBACK],
    },
    referrer: 'no-referrer-when-downgrade',
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `/en${url}`,
        pt: `/pt${url}`,
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: lng === 'pt' ? SITE_LOCALE_PT : SITE_LOCALE_EN,
      alternateLocale: lng === 'pt' ? SITE_LOCALE_EN : SITE_LOCALE_PT,
      images: [
        {
          url: OG_IMAGE_FALLBACK,
          width: 1200,
          height: 630,
          alt: title || SITE_NAME,
        },
      ],
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon/favicon-16x16.png',
      apple: '/favicon/apple-touch-icon.png',
    },
    applicationName: `${SITE_NAME} Website`,
    generator: 'Next.js',
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  } as Metadata;
};

export { getMetadataPageInfo, prepareMetadataInfo };
