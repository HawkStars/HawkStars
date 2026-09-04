import * as Sentry from '@sentry/nextjs';
import { Metadata } from 'next/types';

import { Language, fallbackLng, languages } from '@/i18n/settings';
import { SITE_GET_URLS, HawkStarsPaths } from './paths';
import {
  BASE_URL,
  OG_IMAGE_FALLBACK,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  SITE_NAME,
  SITE_LOCALE_PT,
  SITE_LOCALE_EN,
} from '@/lib/constants';
import PT_Metadata from '../i18n/locales/pt/metadata.json';
import EN_Metadata from '../i18n/locales/en/metadata.json';
import assert from 'assert';
import { ImageType, Media } from '@/payload-types';
import { createOGImageUrl, getImagePayloadUrl } from '@/lib/image';

const readMetadataLanguageFile = (lng: Language) => {
  const file = lng == 'pt' ? PT_Metadata : EN_Metadata;
  return file ?? undefined;
};

type MetadataImageType = ImageType | Media | string | null;

type MetadataProps = {
  title?: string | null;
  description?: string | null;
  image?: MetadataImageType;
  url?: string;
  lng?: Language;
};

const prepareMetadataInfo = ({ title, description, image, lng, url }: MetadataProps): Metadata => {
  return createMetadataObject({
    title,
    description,
    image,
    lng,
    url,
  });
};

const getMetadataPageInfo = (lng: Language, page: HawkStarsPaths): Metadata => {
  const defaultPath = 'home' as HawkStarsPaths;
  if (!languages.includes(lng)) {
    lng = fallbackLng;
  }
  const JSONFile = readMetadataLanguageFile(lng);
  assert(JSONFile, `Metadata JSON file for language "${lng}" is not available.`);

  const metadataPageInfo = JSONFile[page];
  const url = SITE_GET_URLS[page] || SITE_GET_URLS[defaultPath];
  return transformToMetadataObject(metadataPageInfo, lng, url);
};

const transformToMetadataObject = (
  info: { title: string; description: string },
  lng: Language,
  url: string,
  image?: MetadataImageType
): Metadata => {
  const { title, description } = info || {};
  if (!title || !description) {
    // Defer Sentry logging to avoid crypto.randomUUID() during static prerendering
    // See: https://nextjs.org/docs/messages/next-prerender-crypto
    setTimeout(() => {
      Sentry.captureMessage(`${url} is missing metadata`, { extra: { url, lng } });
    }, 0);
  }

  return createMetadataObject({
    title,
    description,
    image,
    lng,
    url,
  });
};

const createMetadataObject = (props: MetadataProps): Metadata => {
  const { title, description, lng, url, image } = props;

  // One normalised path drives canonical, hreflang and og:url, so a
  // self-referencing hreflang can never disagree with the canonical.
  const locale = lng ?? fallbackLng;
  const path = !url || url === '/' ? '' : url.replace(/\/$/, '');
  const canonicalUrl = `${BASE_URL}/${locale}${path}`;

  const resolved = createOGImageUrl(image);
  const imageSrc = resolved?.url || OG_IMAGE_FALLBACK;
  const imageAlt = resolved?.alt || title || SITE_NAME;
  const width = resolved?.width ?? OG_IMAGE_WIDTH;
  const height = resolved?.height ?? OG_IMAGE_HEIGHT;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': `/pt${path}`,
        en: `/en${path}`,
        pt: `/pt${path}`,
      },
    },

    authors: [
      {
        name: 'Paulo Cardoso',
        url: 'https://www.linkedin.com/in/pcardosolei/',
      },
      {
        name: 'Rodrigo Rosselini',
        url: 'https://www.linkedin.com/in/rodrigo-rossellini-correa/',
      },
      {
        name: 'HawkStars Team',
        url: 'https://hawkstars.org/',
      },
    ],
    openGraph: {
      type: 'website',
      title: title ?? '',
      description: description ?? '',
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: locale === 'pt' ? SITE_LOCALE_PT : SITE_LOCALE_EN,
      alternateLocale: locale === 'pt' ? SITE_LOCALE_EN : SITE_LOCALE_PT,
      images: [
        {
          url: imageSrc,
          width,
          height,
          alt: imageAlt,
        },
      ],
    },
    referrer: 'no-referrer-when-downgrade',
    twitter: {
      card: 'summary_large_image',
      title: title ?? '',
      description: description ?? '',
      images: [imageSrc],
    },
    appleWebApp: false,
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
  };
};

export { getMetadataPageInfo, prepareMetadataInfo };
