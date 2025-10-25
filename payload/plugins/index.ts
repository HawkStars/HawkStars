import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage';
import { seoPlugin } from '@payloadcms/plugin-seo';
import { Plugin } from 'payload';
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types';

import { Page, Post } from '@/payload-types';
import { getServerSideURL } from '@/payload/utilities/getURL';
import { cloudinaryAdapter } from '@/lib/cloudinary/adapter';
import { v2 as cloudinary } from 'cloudinary';

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template';
};

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL();

  return doc?.slug ? `${url}/${doc.slug}` : url;
};

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  cloudStoragePlugin({
    collections: {
      media: {
        adapter: cloudinaryAdapter,

        disableLocalStorage: true, // Prevent Payload from saving files to disk

        generateFileURL: ({ filename }) => {
          return cloudinary.url(`media/${filename}`, { secure: true });
        },
      },
    },
  }),
];
