import type { GlobalConfig } from 'payload';

import { authenticated } from '@/payload/access/authenticated';
import {
  OverviewField,
  MetaTitleField,
  MetaImageField,
  MetaDescriptionField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields';
import { revalidateMainPage } from './hooks/revalidateMainPage';
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import { MainPageBlocks } from '@/payload/blocks';
import { getServerSideURL } from '@/payload/utilities/getURL';
import { PayloadImageField } from '@/payload/fields/ImageType';

export const MainPage: GlobalConfig = {
  slug: 'main-page',
  label: {
    pt: 'Página Principal',
    en: 'Main Page',
  },
  admin: {
    description: 'Configure the main landing page of the website.',
    preview: () => `/`,
    livePreview: {
      url: ({ locale }) => {
        const baseUrl = getServerSideURL();
        const lang = locale?.code || 'pt';

        return `${baseUrl}/${lang}/preview`;
      },
    },
  },
  access: {
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'layout',
              type: 'richText',
              required: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  BlocksFeature({
                    blocks: MainPageBlocks,
                    inlineBlocks: [],
                  }),
                ],
              }),
            },
            {
              name: 'Banner',
              type: 'group',
              admin: {
                description: 'Optional banner displayed at the top of the page.',
              },
              fields: [
                {
                  name: 'bannerColor',
                  type: 'text',
                  admin: {
                    position: 'sidebar',
                    description: 'Hex color code for the banner background (e.g. #ff0000)',
                  },
                  required: false,
                  validate: (value: string | undefined | null) => {
                    if (value && !/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
                      return 'Must be a valid hex color code';
                    }
                    return true;
                  },
                },
                {
                  name: 'bannerText',
                  type: 'text',
                  admin: { position: 'sidebar', description: 'Text to display in the banner' },
                  required: false,
                },
                PayloadImageField({
                  name: 'bannerImage',
                  hideGutter: true,
                  description:
                    'Optional image for the banner. Will be used as a background on desktop and inline on mobile.',
                  required: false,
                }),
              ],
            },
          ],
          label: 'Content',
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
  ],
  hooks: {
    afterChange: [revalidateMainPage],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    max: 3,
  },
};
