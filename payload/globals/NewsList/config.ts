import type { GlobalConfig } from 'payload';

import { authenticated } from '@/payload/access/authenticated';

export const NewsList: GlobalConfig = {
  slug: 'news-list',
  label: {
    pt: 'Lista de Notícias',
    en: 'News List',
  },
  admin: {
    description: 'Configure the list of news list information.',
  },
  access: {
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: {
        pt: 'Título da Lista de Notícias',
        en: 'News List Title',
      },
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: {
        pt: 'Subtítulo da Lista de Notícias',
        en: 'News List Subtitle',
      },
      required: false,
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    max: 3,
  },
};
