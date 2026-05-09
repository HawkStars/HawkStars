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
import BannerFields from './fields/BannerFields';

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
            BannerFields,
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
