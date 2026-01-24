import type { GlobalConfig } from 'payload';

import { authenticated } from '@/payload/access/authenticated';

export const NewsList: GlobalConfig = {
  slug: 'news-list',
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
      label: 'News List Title',
      required: true,
    },
    { name: 'subtitle', type: 'text', label: 'News List Subtitle', required: false },
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
