import type { GlobalConfig } from 'payload';

import { authenticated } from '@/payload/access/authenticated';
import { getServerSideURL } from '@/payload/utilities/getURL';
import { GROUP_LABELS } from '@/payload/constants';

export const NewsList: GlobalConfig = {
  slug: 'news-list',
  label: {
    pt: 'Lista de Notícias',
    en: 'News List',
  },
  admin: {
    group: GROUP_LABELS.news,
    description: {
      en: 'Configure the news list page header information.',
      pt: 'Configure a informação do cabeçalho da página de listagem de notícias.',
    },
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
        description: {
          en: 'This title will be used as the main heading for the news list page.',
          pt: 'Este título será usado como cabeçalho principal da página de listagem de notícias.',
        },
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
        description: {
          en: 'This subtitle will be used as the secondary heading for the news list page.',
          pt: 'Este subtítulo será usado como cabeçalho secundário da página de listagem de notícias.',
        },
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
