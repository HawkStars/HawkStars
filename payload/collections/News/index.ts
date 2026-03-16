import type { CollectionConfig } from 'payload';
import { authenticated } from '@/payload/access/authenticated';
import { anyone } from '@/payload/access/anyone';
import { populatePublishedAt } from '@/payload/hooks/populatePublishedAt';
import { notifyOnStatusChange } from '@/payload/hooks/notifyOnStatusChange';
import { validateStatusTransition } from '@/payload/hooks/validateStatusTransition';
import { contentStatusField } from '@/payload/fields/contentStatus';
import NewsDetails from './NewsFields';
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields';

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: 'News Article',
    plural: 'News Articles',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'slug', 'status', 'updatedAt'],
    description:
      'Write and publish news articles for the HawkStars website. Articles follow a workflow: Draft → In Review → Published. Editors submit for review; Admins approve and publish.',
    group: {
      name: 'Daily Work',
    },
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  access: {
    admin: authenticated,
    read: anyone,
    create: authenticated,
    delete: authenticated,
    update: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        NewsDetails,
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),

            MetaTitleField({
              hasGenerateFn: true,
              overrides: {
                maxLength: 60,
              },
            }),

            MetaImageField({
              relationTo: 'media',
              hasGenerateFn: true,
              overrides: {
                admin: {
                  description: 'Recommended size: 1200x630 pixels',
                },
              },
            }),

            MetaDescriptionField({
              hasGenerateFn: true,
              overrides: {
                maxLength: 160,
              },
            }),

            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    contentStatusField,
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description:
          'The URL slug for the news article, e.g. "my-article" for www.hawkstars.com/news/my-article',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Automatically set when status changes to Published',
      },
    },
  ],
  hooks: {
    afterChange: [notifyOnStatusChange],
    beforeChange: [validateStatusTransition, populatePublishedAt],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 10,
  },
};
