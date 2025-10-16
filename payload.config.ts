// storage-adapter-import-placeholder
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage';

import { mongooseAdapter } from '@payloadcms/db-mongodb';

import assert from 'assert';
import { ArtCollection } from './collections/ArtCollection';
import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { BoardMember } from './collections/BoardMember';
import { ContributionCollection as Contribution } from './collections/Contribution';
import { Curator } from './collections/Curator';
import { HawkEvent } from './collections/HawkEvent';
import { Partner } from './collections/Partner';
import totalContributioValueQuery from './lib/payload/endpoints/totalContributioValueQuery';
import { cloudinaryAdapter, cloudinaryClient } from './lib/cloudinary/adapter';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

assert(process.env.DATABASE_URI, 'DATABASE_URI environment variable is not assigned');
assert(process.env.PAYLOAD_SECRET, 'PAYLOAD_SECRET environment variable is not assigned');

assert(
  process.env.CLOUDINARY_CLOUD_NAME,
  'CLOUDINARY_CLOUD_NAME environment variable is not assigned'
);
assert(process.env.CLOUDINARY_API_KEY, 'CLOUDINARY_API_KEY environment variable is not assigned');
assert(
  process.env.CLOUDINARY_API_SECRET,
  'CLOUDINARY_API_SECRET environment variable is not assigned'
);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  localization: {
    defaultLocale: 'pt',
    locales: [
      { label: 'English', code: 'en', fallbackLocale: 'pt' },
      { label: 'Portuguese', code: 'pt' },
      { label: 'French', code: 'fr', fallbackLocale: 'pt' },
    ],
    fallback: true,
  },
  collections: [
    Users,
    Media,
    ArtCollection,
    BoardMember,
    Contribution,
    Curator,
    HawkEvent,
    Partner,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://database:27017/hawkstars',
  }),
  sharp,
  plugins: [
    cloudStoragePlugin({
      collections: {
        media: {
          adapter: cloudinaryAdapter,

          disableLocalStorage: true, // Prevent Payload from saving files to disk

          generateFileURL: ({ filename }) => {
            return cloudinaryClient.url(`media/${filename}`, { secure: true });
          },
        },
      },
    }),
  ],
  endpoints: [
    {
      path: '/sum-contributions',
      method: 'get',
      handler: totalContributioValueQuery,
    },
  ],
});
