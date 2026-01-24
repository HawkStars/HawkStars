import type { GlobalConfig } from 'payload';

import { authenticated } from '@/payload/access/authenticated';

export const ProjectsList: GlobalConfig = {
  slug: 'projects-list',
  admin: {
    description: 'Configure the list of projects list information.',
  },
  access: {
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Projects List Title',
      required: true,
    },
    { name: 'subtitle', type: 'text', label: 'Projects List Subtitle', required: false },
    {
      name: 'video',
      type: 'text',
      label: 'Projects List Video URL',
      required: false,
      admin: { description: 'Show the latest project video' },
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
