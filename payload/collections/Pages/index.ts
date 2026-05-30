import type { CollectionConfig } from 'payload';
import { authenticated } from '@/payload/access/authenticated';
import { populatePublishedAt } from '../../hooks/populatePublishedAt';
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage';
import { notifyOnStatusChange } from '@/payload/hooks/notifyOnStatusChange';
import { validateStatusTransition } from '@/payload/hooks/validateStatusTransition';
import { contentStatusField } from '@/payload/fields/contentStatus';

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields';
import { DefaultBlocks } from '@/payload/blocks';

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  labels: {
    singular: { en: 'Page', pt: 'Página' },
    plural: { en: 'Pages', pt: 'Páginas' },
  },
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
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    description:
      'Create and manage website pages. Use the Content tab to build layouts with rich text or blocks, and the SEO tab for search optimization. Pages follow a workflow: Draft → In Review → Published. Editors submit for review; Admins approve and publish.',
    group: {
      name: 'Daily Work',
    },
  },
  fields: [
    {
      name: 'title',
      label: { en: 'Title', pt: 'Título' },
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
              name: 'contentType',
              label: { en: 'Content Type', pt: 'Tipo de Conteúdo' },
              type: 'radio',
              options: [
                { label: { en: 'Rich Text Layout', pt: 'Layout com Texto Rico' }, value: 'richText' },
                { label: { en: 'Blocks Only', pt: 'Apenas Blocos' }, value: 'blocks' },
              ],
              defaultValue: 'richText',
              admin: {
                description:
                  'Choose how to build the page content. "Rich Text Layout" allows mixing text and blocks in a flexible layout, while "Blocks Only" provides a simpler interface for adding blocks without rich text.',
              },
            },
            {
              name: 'layout',
              admin: {
                description: 'Add, remove, and reorder blocks to build the content of the page',
                condition: (data) => data.contentType === 'richText',
              },
              type: 'richText',
              required: false,
              localized: true,
              label: { en: 'Page Layout w/ Rich Text', pt: 'Layout da Página com Texto Rico' },
            },
            {
              name: 'blocks',
              type: 'blocks',
              blocks: DefaultBlocks,
              admin: {
                description: 'In case you want to use blocks separately from the rich text layout',
                condition: (data) => data.contentType === 'blocks',
              },
              required: false,
              label: { en: 'Page Blocks Only', pt: 'Apenas Blocos da Página' },
              labels: {
                singular: { en: 'Page Block', pt: 'Bloco de Página' },
                plural: { en: 'Page Blocks', pt: 'Blocos de Página' },
              },
            },
          ],
          label: { en: 'Content', pt: 'Conteúdo' },
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
    contentStatusField,
    {
      name: 'publishedAt',
      label: { en: 'Published At', pt: 'Publicado Em' },
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Automatically set when status changes to Published',
      },
    },
    {
      name: 'slug',
      label: 'Slug',
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
    afterChange: [revalidatePage, notifyOnStatusChange],
    beforeChange: [validateStatusTransition, populatePublishedAt],
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
