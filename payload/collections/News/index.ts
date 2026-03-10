import type { CollectionConfig } from 'payload';
import { authenticated } from '@/payload/access/authenticated';
import { anyone } from '@/payload/access/anyone';
import { populatePublishedAt } from '@/payload/hooks/populatePublishedAt';
import { notifyOnNewsChange } from '@/payload/hooks/notifyOnNewsChange';
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
    defaultColumns: ['title', 'type', 'slug', 'updatedAt'],
    description: 'Collection for managing News articles',
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
        description: 'The date when the article was published',
      },
    },
    {
      name: 'visible',
      type: 'checkbox',
      label: 'Visible on site',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Whether the article is visible on the site',
      },
    },
  ],
  hooks: {
    afterChange: [notifyOnNewsChange],
    beforeChange: [populatePublishedAt],
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
