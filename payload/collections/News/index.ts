import type { CollectionConfig } from 'payload';
import { authenticated } from '@/payload/access/authenticated';
import { anyone } from '@/payload/access/anyone';
import { populatePublishedAt } from '@/payload/hooks/populatePublishedAt';
import NewsDetails from './NewsFields';
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields';
import { GROUP_LABELS } from '@/payload/constants';
import { getServerSideURL } from '@/payload/utilities/getURL';

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: { en: 'News Article', pt: 'Notícia' },
    plural: { en: 'News Articles', pt: 'Notícias' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'slug', '_status', 'updatedAt'],
    description: {
      en: 'Write and publish news articles for the HawkStars website. Save as Draft while editing and Publish when ready to go live.',
      pt: 'Escreva e publique artigos de notícias para o website HawkStars. Guarde como Rascunho durante a edição e Publique quando estiver pronto.',
    },
    group: {
      ...GROUP_LABELS.news,
    },
    livePreview: {
      url: ({ locale, data }) => {
        const baseUrl = getServerSideURL();
        const lang = locale?.code || 'pt';

        return `${baseUrl}/${lang}/preview/news/${data.slug}`;
      },
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
                  description: {
                    en: 'Recommended size: 1200x630 pixels',
                    pt: 'Tamanho recomendado: 1200x630 pixels',
                  },
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
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: {
          en: 'The URL slug for the news article, e.g. "my-article" for www.hawkstars.com/news/my-article',
          pt: 'O slug de URL para o artigo, ex: "meu-artigo" para www.hawkstars.com/news/meu-artigo',
        },
      },
    },
    {
      name: 'publishedAt',
      label: { en: 'Published At', pt: 'Publicado Em' },
      type: 'date',
      admin: {
        position: 'sidebar',
        description: {
          en: 'Automatically set when the article is published',
          pt: 'Definido automaticamente quando o artigo é publicado',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 5,
  },
};
