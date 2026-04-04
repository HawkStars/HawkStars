import type { GlobalConfig } from 'payload';

import { authenticated } from '@/payload/access/authenticated';
import { getServerSideURL } from '@/payload/utilities/getURL';

export const NewsList: GlobalConfig = {
  slug: 'news-list',
  label: {
    pt: 'Lista de Notícias',
    en: 'News List',
  },
  admin: {
    description: 'Configure the list of news list information.',
    livePreview: {
      url: ({ locale }) => {
        const baseUrl = getServerSideURL();
        const lang = locale?.code || 'pt';

        return `${baseUrl}/${lang}/preview/news`;
      },
    },
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
      admin: {
        description: 'This title will be used as the main heading for the news list page.',
      },
      localized: true,
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: {
        pt: 'Subtítulo da Lista de Notícias',
        en: 'News List Subtitle',
      },
      admin: {
        description: 'This subtitle will be used as the secondary heading for the news list page.',
      },
      localized: true,
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
