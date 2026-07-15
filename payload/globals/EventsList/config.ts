import type { GlobalConfig } from 'payload';

import { authenticated } from '@/payload/access/authenticated';
import SectionID from '@/payload/fields/SectionID';
import { authenticatedEditor } from '@/payload/access/authenticatedEditor';
import { PayloadImageField } from '@/payload/fields/ImageType';
import { linkGroup } from '@/payload/fields/linkGroup';
import { getServerSideURL } from '@/payload/utilities/getURL';
import PayloadLucideIcon from '@/payload/fields/ImageIcon/payload-lucide-icon';
import { GROUP_LABELS } from '@/payload/constants';

export const EventsList: GlobalConfig = {
  slug: 'events-list',
  label: {
    pt: 'Página Principal de Eventos',
    en: 'Events List Main Page',
  },
  admin: {
    group: GROUP_LABELS.events,
    description: {
      en: 'Configure the events list page header information.',
      pt: 'Configure a informação do cabeçalho da página de listagem de eventos.',
    },
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
      admin: {
        description: {
          en: 'Show the latest event video.',
          pt: 'Mostrar o vídeo do evento mais recente.',
        },
      },
    },
    {
      name: 'badge',
      type: 'text',
      label: { pt: 'Badge', en: 'Badge' },
      required: false,
      localized: true,
      admin: {
        description: {
          en: 'A small badge displayed next to the title.',
          pt: 'Um pequeno distintivo exibido ao lado do título.',
        },
      },
    },
    PayloadImageField({
      name: 'heroImage',
      label: 'Hero Image',
      description: {
        en: 'Image displayed at the top of the events list page. Takes priority over the video if both are added.',
        pt: 'Imagem exibida no topo da página de eventos. Tem prioridade sobre o vídeo se ambos forem adicionados.',
      },
      required: false,
    }),
    {
      name: 'stats',
      type: 'array',
      interfaceName: 'EventsListStatsItem',
      label: { pt: 'Estatísticas de Impacto', en: 'Impact Stats' },
      admin: {
        description: {
          en: 'Show the events stats',
          pt: 'Mostrar as estatísticas dos eventos',
        },
        components: {
          RowLabel: '@/payload/globals/EventsList/components/StatsLabel',
        },
      },
      fields: [
        PayloadLucideIcon(),
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
          description: {
            en: 'Add links to the events list page as buttons',
            pt: 'Adicionar links à página de eventos como botões',
          },
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
