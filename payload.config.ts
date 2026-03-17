import {
  BlocksFeature,
  lexicalEditor,
  defaultColors,
  TextStateFeature,
  FixedToolbarFeature,
} from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import nodemailer from 'nodemailer';

import assert from 'assert';
import { ArtCollection } from './payload/collections/ArtCollection';
import { Users } from './payload/collections/Users';
import { Media } from './payload/collections/Media';
import { BoardMember } from './payload/collections/BoardMember';
import { ContributionCollection as Contribution } from './payload/collections/Contribution';
import { Curator } from './payload/collections/Curator';
import { Partner } from './payload/collections/Partner';
import totalContributioValueQuery from './lib/payload/endpoints/totalContributioValueQuery';
import dashboardStatsHandler from './payload/endpoints/dashboardStats';
import {
  getNotificationsHandler,
  markNotificationsReadHandler,
} from './payload/endpoints/notifications';
import { Notification } from './payload/collections/Notification';

import { Footer } from './payload/globals/Footer/config';
import { Header } from './payload/globals/Header/config';
import { Pages } from './payload/collections/Pages';
import { plugins } from './payload/plugins';
import { HawkProject } from './payload/collections/HawkProject';
import { MainPage } from './payload/globals/MainPage/config';
import blocks from './payload/blocks';
import { NewsList } from './payload/globals/NewsList/config';
import { ProjectsList } from './payload/globals/ProjectsList/config';
import { News } from './payload/collections/News';
import { getServerSideURL } from './payload/utilities/getURL';

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
    components: {
      graphics: {
        Logo: '@/payload/components/Logo',
      },
      afterNavLinks: ['@/payload/components/admin/NotificationBell'],
      views: {
        dashboard: {
          Component: '@/payload/components/admin/CustomDashboard',
        },
      },
    },
    avatar: { Component: '@/payload/components/admin/avatar' },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
      collections: ['pages', 'news', 'hawk_projects'],
      globals: ['main-page'],
      url: ({ data, collectionConfig, globalConfig, locale }) => {
        const baseUrl = getServerSideURL();
        const lang = locale?.code || 'pt';

        if (collectionConfig?.slug === 'news') {
          return `${baseUrl}/${lang}/preview/news/${data?.slug || ''}`;
        }

        if (collectionConfig?.slug === 'hawk_projects') {
          return `${baseUrl}/${lang}/preview/projects/${data?.slug || ''}`;
        }

        if (globalConfig?.slug === 'main-page') {
          return `${baseUrl}/${lang}/preview`;
        }

        return `${baseUrl}/${lang}/preview/${data?.slug || ''}`;
      },
    },
  },
  localization: {
    defaultLocale: 'pt',
    locales: [
      { label: 'English', code: 'en', fallbackLocale: 'pt' },
      { label: 'Portuguese', code: 'pt' },
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
    HawkProject,
    Partner,
    Pages,
    News,
    Notification,
  ],
  globals: [Header, Footer, MainPage, NewsList, ProjectsList],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: blocks,
        inlineBlocks: [],
      }),
      TextStateFeature({
        state: { color: { ...defaultColors.background, ...defaultColors.text } },
      }),
      FixedToolbarFeature(),
    ],
  }),
  blocks: blocks,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost:27017/hawkstars',
  }),
  email: nodemailerAdapter({
    defaultFromAddress: 'tech@hawkstars.org',
    defaultFromName: 'HawkStarsNGO - Tech Team',
    transport: await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        expires: 3599,
      },
    }),
  }),
  sharp,
  plugins: plugins,
  endpoints: [
    {
      path: '/sum-contributions',
      method: 'get',
      handler: totalContributioValueQuery,
    },
    {
      path: '/dashboard-stats',
      method: 'get',
      handler: dashboardStatsHandler,
    },
    {
      path: '/notifications',
      method: 'get',
      handler: getNotificationsHandler,
    },
    {
      path: '/notifications/mark-read',
      method: 'post',
      handler: markNotificationsReadHandler,
    },
  ],
  onInit: async () => {
    // await seed(payload);
  },
});
