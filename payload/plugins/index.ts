import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage';
import { seoPlugin } from '@payloadcms/plugin-seo';
import { Plugin } from 'payload';
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types';
import { sentryPlugin } from '@payloadcms/plugin-sentry';
import { payloadTotp } from 'payload-totp';
import * as Sentry from '@sentry/nextjs';

import { Page } from '@/payload-types';
import { getServerSideURL } from '@/payload/utilities/getURL';
import { cloudinaryAdapter } from '@/lib/cloudinary/adapter';
import { googleDriveAdapter, generateGoogleDriveURL } from '@/lib/google-drive/adapter';
import { v2 as cloudinary } from 'cloudinary';
import { showLocaleValuesPlugin } from './showLocaleValues';

const generateTitle: GenerateTitle<Page> = ({ doc }) => {
  return doc?.title || 'Payload Website Template';
};

const generateURL: GenerateURL<Page> = ({ doc }) => {
  const url = getServerSideURL();

  return doc?.slug ? `${url}/${doc.slug}` : url;
};

export const plugins: Plugin[] = [
  showLocaleValuesPlugin,
  seoPlugin({
    generateTitle,
    generateURL,
    generateDescription: ({ doc }) => doc?.description || 'A website built with Payload CMS',
    generateImage: ({ doc }) => doc?.image || null,
  }),
  cloudStoragePlugin({
    collections: {
      media: {
        adapter: cloudinaryAdapter,
        disableLocalStorage: true, // Prevent Payload from saving files to disk
        generateFileURL: ({ filename }) =>
          cloudinary.url(`media/${filename}`, { secure: true, analytics: false }),
      },
      documents: {
        adapter: googleDriveAdapter,
        disableLocalStorage: true,
        disablePayloadAccessControl: true,
        generateFileURL: ({ filename }) => generateGoogleDriveURL(filename),
      },
    },
  }),
  sentryPlugin({
    options: {
      captureErrors: [400, 403, 500],
      context: ({ defaultContext, req }) => {
        return {
          ...defaultContext,
          tags: {
            locale: req.locale,
          },
        };
      },
      debug: process.env.NODE_ENV === 'development',
    },
    Sentry,
  }),

  /** LAST plugin cause of overrides */
  payloadTotp({
    collection: 'users',
    forceSetup: process.env.NODE_ENV === 'production',
    disableAccessWrapper: true,
    totp: {
      issuer: 'HawkStars Admin',
      digits: 6,
      period: 30,
    },
    disabled: process.env.NODE_ENV === 'development',
  }),
];
