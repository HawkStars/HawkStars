// storage-adapter-import-placeholder
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { mongooseAdapter } from '@payloadcms/db-mongodb';

import assert from 'assert';
import { ArtCollection } from './payload/collections/ArtCollection';
import { Users } from './payload/collections/Users';
import { Media } from './payload/collections/Media';
import { BoardMember } from './payload/collections/BoardMember';
import { ContributionCollection as Contribution } from './payload/collections/Contribution';
import { Curator } from './payload/collections/Curator';
import { Partner } from './payload/collections/Partner';
import totalContributioValueQuery from './lib/payload/endpoints/totalContributioValueQuery';

import { Footer } from './payload/globals/Footer/config';
import { Header } from './payload/globals/Header/config';
import { Pages } from './payload/collections/Pages';
import { plugins } from './payload/plugins';
import { HawkEvent } from './payload/collections/HawkEvent';
import { CallToAction } from './payload/blocks/CallToAction/config';
import { ContentWithImage } from './payload/blocks/ContentWithImage/config';
import { GallerySlider } from './payload/blocks/GallerySlider/config';
import { Hero } from './payload/blocks/Hero/config';
import { MediaBlock } from './payload/blocks/MediaBlock/config';

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
      // { label: 'French', code: 'fr', fallbackLocale: 'pt' },
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
    Pages,
  ],
  globals: [Header, Footer],
  editor: lexicalEditor({
    features: ({ defaultFeatures, rootFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [CallToAction, MediaBlock, GallerySlider, Hero, ContentWithImage],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost:27017/hawkstars',
  }),
  sharp,
  plugins: plugins,
  endpoints: [
    {
      path: '/sum-contributions',
      method: 'get',
      handler: totalContributioValueQuery,
    },
  ],
});
