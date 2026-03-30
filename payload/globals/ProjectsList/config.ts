import type { GlobalConfig } from 'payload';

import { authenticated } from '@/payload/access/authenticated';

export const ProjectsList: GlobalConfig = {
  slug: 'projects-list',
  label: {
    pt: 'Lista de Projetos',
    en: 'Projects List',
  },
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
      label: {
        pt: 'Título da Lista de Projetos',
        en: 'Projects List Title',
      },
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: {
        pt: 'Subtítulo da Lista de Projetos',
        en: 'Projects List Subtitle',
      },
      required: false,
    },
    {
      name: 'video',
      type: 'text',
      label: {
        pt: 'URL do Vídeo da Lista de Projetos',
        en: 'Projects List Video URL',
      },
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
