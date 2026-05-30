import type { GlobalConfig } from 'payload';

import { authenticated } from '@/payload/access/authenticated';
import SectionID from '@/payload/fields/SectionID';
import { authenticatedEditor } from '@/payload/access/authenticatedEditor';
import { PayloadImageField } from '@/payload/fields/ImageType';
import { linkGroup } from '@/payload/fields/linkGroup';
import { getServerSideURL } from '@/payload/utilities/getURL';
import PayloadLucideIcon from '@/payload/fields/ImageIcon/payload-lucide-icon';

export const ProjectsList: GlobalConfig = {
  slug: 'projects-list',
  label: {
    pt: 'Lista de Projetos',
    en: 'Projects List',
  },
  admin: {
    description: {
      en: 'Configure the projects list page header information.',
      pt: 'Configure a informação do cabeçalho da página de listagem de projetos.',
    },
    livePreview: {
      url: ({ locale }) => {
        const baseUrl = getServerSideURL();
        const lang = locale?.code || 'pt';

        return `${baseUrl}/${lang}/preview/projects`;
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
        pt: 'Título da Lista de Projetos',
        en: 'Projects List Title',
      },
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: {
        pt: 'Subtítulo da Lista de Projetos',
        en: 'Projects List Subtitle',
      },
      required: false,
      localized: true,
    },
    {
      name: 'video',
      type: 'text',
      label: {
        pt: 'URL do Vídeo da Lista de Projetos',
        en: 'Projects List Video URL',
      },
      required: false,
      admin: {
        description: {
          en: 'Show the latest project video.',
          pt: 'Mostrar o vídeo do projeto mais recente.',
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
        en: 'Image displayed at the top of the projects list page. Takes priority over the video if both are added.',
        pt: 'Imagem exibida no topo da página de projetos. Tem prioridade sobre o vídeo se ambos forem adicionados.',
      },
      required: false,
    }),
    {
      name: 'stats',
      type: 'array',
      interfaceName: 'ProjectsListStatsItem',
      label: { pt: 'Estatísticas de Impacto', en: 'Impact Stats' },
      admin: {
        description: {
          en: 'Show the projects stats',
          pt: 'Mostrar as estatísticas dos projetos',
        },
        components: {
          RowLabel: '@/payload/globals/ProjectsList/components/StatsLabel',
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
            en: 'Add links to the projects list page as buttons',
            pt: 'Adicionar links à página de projetos como botões',
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
        interval: 100, // We set this interval for optimal live preview
      },
    },
    max: 3,
  },
};
