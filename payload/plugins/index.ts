import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage';
import { seoPlugin } from '@payloadcms/plugin-seo';
import { Plugin } from 'payload';
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types';

import { Page } from '@/payload-types';
import { getServerSideURL } from '@/payload/utilities/getURL';
import { cloudinaryAdapter } from '@/lib/cloudinary/adapter';
import { v2 as cloudinary } from 'cloudinary';

const generateTitle: GenerateTitle<Page> = ({ doc }) => {
  return doc?.title || 'Payload Website Template';
};

const generateURL: GenerateURL<Page> = ({ doc }) => {
  const url = getServerSideURL();

  return doc?.slug ? `${url}/${doc.slug}` : url;
};

export const plugins: Plugin[] = [
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
        generateFileURL: ({ filename }) => cloudinary.url(`media/${filename}`, { secure: true }),
      },
    },
  }),
];
