import type { GlobalConfig } from 'payload';

import { icons } from 'lucide-react';
import { authenticated } from '@/payload/access/authenticated';
import SectionID from '@/payload/fields/SectionID';
import { authenticatedEditor } from '@/payload/access/authenticatedEditor';
import { PayloadImageField } from '@/payload/fields/ImageType';
import { linkGroup } from '@/payload/fields/linkGroup';

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
    update: authenticatedEditor,
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
      admin: { description: 'Show the latest project video.' },
    },
    { name: 'badge', type: 'text', label: { pt: 'Badge', en: 'Badge' }, required: false },
    PayloadImageField({
      name: 'heroImage',
      label: 'Hero Image',
      description:
        'Image displayed at the top of the projects list page. Tem prioridade ao video caso ambos sejam adicionados.',
      required: false,
    }),
    {
      name: 'stats',
      type: 'array',
      label: { pt: 'Estatísticas de Impacto', en: 'Impact Stats' },
      admin: { description: 'Show the projects stats' },
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icon (SVG)',
          admin: {
            description: 'Full list at https://lucide.dev/icons/',
            components: {
              Field: '@/payload/fields/ImageIcon/components/Field',
            },
          },
          options: Object.keys(icons).map((iconKey) => ({
            label: iconKey,
            value: iconKey,
          })),
          required: false,
        },
        { name: 'number', type: 'text', label: { pt: 'Número', en: 'Number' }, required: true },
        { name: 'label', type: 'text', label: { pt: 'Rótulo', en: 'Label' }, required: true },
      ],
      maxRows: 4,
      required: true,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          description: 'Add links to the projects list page as buttons',
        },
      },
    }),
    SectionID,
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
