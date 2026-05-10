import type { GlobalConfig } from 'payload';

import * as LuIcons from 'react-icons/lu';
import { authenticated } from '@/payload/access/authenticated';
import SectionID from '@/payload/fields/SectionID';
import { authenticatedEditor } from '@/payload/access/authenticatedEditor';
import { PayloadImageField } from '@/payload/fields/ImageType';
import { linkGroup } from '@/payload/fields/linkGroup';
import { getServerSideURL } from '@/payload/utilities/getURL';

export const EventsList: GlobalConfig = {
  slug: 'events-list',
  label: {
    pt: 'Lista de Eventos',
    en: 'Events List',
  },
  admin: {
    description: 'Configure the events list page header information.',
    livePreview: {
      url: ({ locale }) => {
        const baseUrl = getServerSideURL();
        const lang = locale?.code || 'pt';

        return `${baseUrl}/${lang}/preview/events`;
      },
    },
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
        pt: 'Título da Lista de Eventos',
        en: 'Events List Title',
      },
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: {
        pt: 'Subtítulo da Lista de Eventos',
        en: 'Events List Subtitle',
      },
      required: false,
      localized: true,
    },
    {
      name: 'video',
      type: 'text',
      label: {
        pt: 'URL do Vídeo da Lista de Eventos',
        en: 'Events List Video URL',
      },
      required: false,
      admin: { description: 'Show the latest event video.' },
    },
    {
      name: 'badge',
      type: 'text',
      label: { pt: 'Badge', en: 'Badge' },
      required: false,
      localized: true,
      admin: { description: 'A small badge displayed next to the title.' },
    },
    PayloadImageField({
      name: 'heroImage',
      label: 'Hero Image',
      description:
        'Image displayed at the top of the events list page. Tem prioridade ao video caso ambos sejam adicionados.',
      required: false,
    }),
    {
      name: 'stats',
      type: 'array',
      interfaceName: 'EventsListStatsItem',
      label: { pt: 'Estatísticas de Impacto', en: 'Impact Stats' },
      admin: {
        description: 'Show the events stats',
        components: {
          RowLabel: '@/payload/globals/EventsList/components/StatsLabel',
        },
      },
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
          options: Object.keys(LuIcons).map((iconKey) => ({
            label: iconKey,
            value: iconKey,
          })),
          required: false,
        },
        { name: 'number', type: 'text', label: { pt: 'Número', en: 'Number' }, required: true },
        {
          name: 'label',
          type: 'text',
          label: { pt: 'Rótulo', en: 'Label' },
          required: true,
          localized: true,
        },
      ],
      maxRows: 4,
      required: true,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          description: 'Add links to the events list page as buttons',
        },
        localized: true,
      },
    }),
    SectionID,
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    max: 3,
  },
};
