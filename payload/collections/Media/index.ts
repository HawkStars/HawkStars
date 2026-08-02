import type { CollectionConfig } from 'payload';
import { notifyMediaDelete, notifyMediaUpload } from './hooks';
import { GROUP_LABELS } from '../../constants';

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { en: 'Media', pt: 'Média' },
    plural: { en: 'Media', pt: 'Média' },
  },
  admin: {
    description: {
      en: 'Upload and manage media assets such as images used throughout the website. Use a image compression tool to optimize images before uploading to improve performance. Ideally in webP',
      pt: 'Carregue e gira recursos de média como imagens usadas no website. Use uma ferramenta de compressão antes de carregar para melhor desempenho. Idealmente em webP.',
    },
    components: {
      views: {
        list: {
          Component: '@/payload/components/admin/MediaListView',
        },
      },
    },
    pagination: {
      limits: [10, 25, 50, 100],
      defaultLimit: 2,
    },
    group: {
      ...GROUP_LABELS.management,
    },
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    disableLocalStorage: true,
    bulkUpload: true,
    displayPreview: true,
  },
  hooks: {
    afterChange: [notifyMediaUpload],
    afterDelete: [notifyMediaDelete],
  },
  fields: [
    {
      name: 'alt',
      label: { en: 'Alt Text', pt: 'Texto Alternativo' },
      type: 'text',
      required: true,
      admin: {
        description: {
          en: 'Alternative text for the media item, used for accessibility.',
          pt: 'Texto alternativo para o item de média, usado para acessibilidade.',
        },
      },
    },
    {
      name: 'section',
      label: { en: 'Section', pt: 'Secção' },
      type: 'text',
      required: false,
      admin: {
        description: {
          en: 'For organizational purposes, specify the section of the website where this media will be used (e.g., Homepage, About Us, Gallery).',
          pt: 'Para fins organizacionais, especifique a secção do website onde este média será utilizado (ex: Página Inicial, Sobre Nós, Galeria).',
        },
      },
    },
  ],
};
