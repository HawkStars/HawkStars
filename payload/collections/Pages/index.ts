import type { CollectionConfig } from 'payload';
import { authenticated } from '@/payload/access/authenticated';
import { populatePublishedAt } from '../../hooks/populatePublishedAt';
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage';
import { notifyOnPageChange } from '@/payload/hooks/notifyOnPageChange';

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields';
import blocks from '@/payload/blocks';

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  orderable: true,
  defaultSort: 'title',

  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'The title of the page displayed in the admin panel',
      },
      required: true,
      localized: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'layout',
              admin: {
                description: 'Add, remove, and reorder blocks to build the content of the page',
              },
              type: 'richText',
              required: false,
              localized: true,
              label: 'Page Layout w/ Rich Text',
            },
            {
              name: 'blocks',
              type: 'blocks',
              blocks: blocks,
              admin: {
                description: 'In case you want to use blocks separately from the rich text layout',
              },
              required: false,
              label: 'Page Blocks Only',
              labels: {
                singular: 'Page Block',
                plural: 'Page Blocks',
              },
            },
          ],
          label: 'Content',
          admin: {
            description: 'Manage the main content of the page',
          },
        },
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
              // if the `generateUrl` function is configured
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'The URL slug for the page, e.g. "about" for www.hawkstars.com/about',
      },
    },
    {
      name: 'visible',
      type: 'checkbox',
      label: 'Visible on site',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    afterChange: [revalidatePage, notifyOnPageChange],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
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
