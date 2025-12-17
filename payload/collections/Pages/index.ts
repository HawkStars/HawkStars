import type { CollectionConfig } from 'payload';
import { authenticated } from '@/payload/access/authenticated';
import { populatePublishedAt } from '../../hooks/populatePublishedAt';
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage';

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
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
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
              localized: true,
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
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
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
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
};
