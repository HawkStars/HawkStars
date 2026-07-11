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
    defaultColumns: ['title', 'type', 'slug', 'status', 'updatedAt'],
    description: {
      en: 'Write and publish news articles for the HawkStars website. Articles follow a workflow: Draft → In Review → Published. Editors submit for review; Admins approve and publish.',
      pt: 'Escreva e publique artigos de notícias para o website HawkStars. Os artigos seguem um fluxo: Rascunho → Em Revisão → Publicado. Os editores submetem para revisão; os administradores aprovam e publicam.',
    },
    group: {
      ...GROUP_LABELS.daily,
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
    contentStatusField,
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
          en: 'Automatically set when status changes to Published',
          pt: 'Definido automaticamente quando o estado muda para Publicado',
        },
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
    maxPerDoc: 5,
  },
};
