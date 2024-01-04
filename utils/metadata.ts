import * as fs from 'fs';
import { Metadata } from 'next';

export type HawkStarsPath =
  | 'partners'
  | 'transparency'
  | 'village'
  | 'home'
  | 'about';

export const defaultMetadata = {
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
} as Metadata;

const readMetadataLanguageFile = (lng: string) => {
  try {
    const file = fs.readFileSync(
      `./i18n/locales/${lng}/metadata.json`,
      'utf-8'
    );

    return JSON.parse(file);
  } catch (err) {
    return undefined;
  }
};

const getMetadataPageInfo = (lng: string, page: HawkStarsPath): Metadata => {
  const defaultPath = 'home' as HawkStarsPath;
  const metadataJSONFile = readMetadataLanguageFile(lng);

  let metadataPageInfo;
  metadataPageInfo = metadataJSONFile[page];

  if (metadataJSONFile)
    return { metadataPageInfo, ...defaultMetadata } as unknown as Metadata;

  // in case someone forgot to add the metadata information
  metadataPageInfo = metadataJSONFile[defaultPath];
  return { metadataPageInfo, ...defaultMetadata } as unknown as Metadata;
};

export { getMetadataPageInfo };
