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
import { en } from '@payloadcms/translations/languages/en';
import { pt } from '@payloadcms/translations/languages/pt';
import nodemailer from 'nodemailer';

import assert from 'assert';
import { ArtCollection } from './payload/collections/ArtCollection';
import { Users } from './payload/collections/Users';
import { Media } from './payload/collections/Media';
import { Documents } from './payload/collections/Documents';
import { BoardMember } from './payload/collections/BoardMember';
import { ContributionCollection as Contribution } from './payload/collections/Contribution';
import { Curator } from './payload/collections/Curator';
import { Partner } from './payload/collections/Partner';
import { Sponsor } from './payload/collections/Sponsor';
import sumContributionsHandler from './payload/endpoints/sumContributions';
import dashboardStatsHandler from './payload/endpoints/dashboardStats';
import {
  getNotificationsHandler,
  markNotificationsReadHandler,
} from './payload/endpoints/notifications';
import translateHandler from './payload/endpoints/translate';
import geocodeHandler from './payload/endpoints/geocode';

import { Notification } from './payload/collections/Notification';
import { Footer } from './payload/globals/Footer/config';
import { Header } from './payload/globals/Header/config';
import { Pages } from './payload/collections/Pages';
import { plugins } from './payload/plugins';
import { HawkProject } from './payload/collections/HawkProject';
import { MainPage } from './payload/globals/MainPage/config';
import { DefaultBlocks } from './payload/blocks';
import { NewsList } from './payload/globals/NewsList/config';
import { ProjectsList } from './payload/globals/ProjectsList/config';
import { News } from './payload/collections/News';
import { getServerSideURL } from './payload/utilities/getURL';
import { seed } from './payload/seed';
import { WebsiteSettings } from './payload/globals/Settings/config';
import { CrowdfundingSettings } from './payload/globals/CrowdfundingSettings/config';
import { jobs } from './payload/jobs';
import { HawkEvent } from './payload/collections/HawkEvent';
import { MemberProject } from './payload/collections/MemberProject';
import { EventsList } from './payload/globals/EventsList/config';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

assert(process.env.DATABASE_URI, 'DATABASE_URI environment variable is not assigned');
assert(process.env.PAYLOAD_SECRET, 'PAYLOAD_SECRET environment variable is not assigned');

assert(
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable is not assigned'
);
assert(process.env.CLOUDINARY_API_KEY, 'CLOUDINARY_API_KEY environment variable is not assigned');
assert(
  process.env.CLOUDINARY_API_SECRET,
  'CLOUDINARY_API_SECRET environment variable is not assigned'
);

// Email is only configured in production (see `email` below). Fail loudly at
// boot if the Gmail OAuth2 credentials are missing, rather than silently
// breaking transactional email (e.g. password resets) at send time.
if (process.env.NODE_ENV === 'production') {
  assert(process.env.GOOGLE_EMAIL_USER, 'GOOGLE_EMAIL_USER environment variable is not assigned');
  assert(
    process.env.GOOGLE_NODEMAILER_CLIENT_ID,
    'GOOGLE_NODEMAILER_CLIENT_ID environment variable is not assigned'
  );
  assert(
    process.env.GOOGLE_NODEMAILER_CLIENT_SECRET,
    'GOOGLE_NODEMAILER_CLIENT_SECRET environment variable is not assigned'
  );
  assert(
    process.env.GOOGLE_NODEMAILER_REFRESH_TOKEN,
    'GOOGLE_NODEMAILER_REFRESH_TOKEN environment variable is not assigned'
  );
}

export default buildConfig({
  serverURL: getServerSideURL(),
  cors: [getServerSideURL()],
  csrf: [getServerSideURL()],
  i18n: {
    supportedLanguages: {
      en,
      pt,
    },
    fallbackLanguage: 'pt',
  },
  admin: {
    timezones: {
      supportedTimezones: [
        {
          label: 'Europe/London',
          value: 'Europe/London',
        },
      ],
      defaultTimezone: 'Europe/London',
    },
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    dateFormat: 'dd/MM/yyyy',
    components: {
      graphics: {
        Logo: '@/payload/components/Logo',
      },
      beforeDashboard: ['@/payload/components/admin/WelcomeDashboard'],
      afterDashboard: ['@/payload/components/admin/DashboardStats'],
      afterNavLinks: ['@/payload/components/admin/TranslateNavLink'],
      views: {
        translate: {
          Component: '@/payload/components/admin/TranslateView#TranslateView',
          path: '/translate',
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
      collections: ['pages', 'news', 'hawk_projects', 'hawk_events'],
      globals: ['main-page'],
      url: ({ data, collectionConfig, locale }) => {
        const baseUrl = getServerSideURL();
        const lang = locale?.code || 'pt';

        if (collectionConfig?.slug === 'hawk_events') {
          return `${baseUrl}/${lang}/preview/events/${data?.slug || ''}`;
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
    Documents,
    ArtCollection,
    BoardMember,
    Contribution,
    Curator,
    HawkProject,
    HawkEvent,
    MemberProject,
    Partner,
    Sponsor,
    Pages,
    News,
    Notification,
  ],
  globals: [
    Header,
    Footer,
    MainPage,
    NewsList,
    ProjectsList,
    EventsList,
    WebsiteSettings,
    CrowdfundingSettings,
  ],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: DefaultBlocks,
        inlineBlocks: [],
      }),
      TextStateFeature({
        state: { color: { ...defaultColors.background, ...defaultColors.text } },
      }),
      FixedToolbarFeature(),
    ],
  }),
  blocks: DefaultBlocks,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
    autoGenerate: true,
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost:27017/hawkstars',
    migrationDir: path.resolve(dirname, 'payload/migrations'),
  }),

  email:
    process.env.NODE_ENV === 'production'
      ? nodemailerAdapter({
          defaultFromAddress: 'tech@hawkstars.org',
          defaultFromName: 'HawkStarsNGO - Tech Team',
          transport: nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: process.env.GOOGLE_EMAIL_USER,
              clientId: process.env.GOOGLE_NODEMAILER_CLIENT_ID,
              clientSecret: process.env.GOOGLE_NODEMAILER_CLIENT_SECRET,
              refreshToken: process.env.GOOGLE_NODEMAILER_REFRESH_TOKEN,
              expires: 3599,
            },
          }),
        })
      : undefined,
  sharp,
  plugins: plugins,
  endpoints: [
    {
      path: '/geocode',
      method: 'get',
      handler: geocodeHandler,
    },
    {
      path: '/sum-contributions',
      method: 'get',
      handler: sumContributionsHandler,
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
    {
      path: '/translate',
      method: 'post',
      handler: translateHandler,
    },
  ],
  jobs,
  onInit: async (payload) => {
    if (process.env.NODE_ENV === 'production') return;
    await seed(payload);
  },
  upload: {
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
  },
});
