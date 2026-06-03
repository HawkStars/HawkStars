import type { CollectionConfig } from 'payload';
import { anyone } from '../../access/anyone';
import { authenticated } from '../../access/authenticated';
import HawkProjectPageTab from './HawkProjectPageTab';
import { sanitizeBrokenImageRelationship } from '../../hooks/sanitizeBrokenImageRelationship';
import { HawkProjectSeoTab } from './HawkProjectSeoTab';
import { contentStatusField } from '@/payload/fields/contentStatus';
import HawkProjectPartnersInformation from './HawkProjectPartnersInformation';
import { getServerSideURL } from '@/payload/utilities/getURL';
import HawkProjectDisseminationFields from './HawkProjectDisseminationFields';
import { GROUP_LABELS } from '@/payload/constants';

export const HawkProject: CollectionConfig = {
  slug: 'hawk_projects',
  labels: {
    singular: {
      en: 'Hawk Project',
      pt: 'Projeto Erasmus da Hawk',
    },
    plural: {
      en: 'Hawk Projects',
      pt: 'Projetos Erasmus da Hawk',
    },
  },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['hero', 'slug', 'startDate'],
    description: {
      en: 'Manage HawkStars projects and events. Add project details, images, and descriptions. Each project gets its own public page based on its slug.',
      pt: 'Gira os projetos e eventos da HawkStars. Adicione detalhes, imagens e descrições. Cada projeto tem a sua própria página pública baseada no slug.',
    },
    group: {
      ...GROUP_LABELS.daily,
    },
    components: {},
    preview: (doc, { locale }) => {
      const baseUrl = getServerSideURL();
      return `${baseUrl}/${locale}/projects/${doc.slug}`;
    },
    livePreview: {
      url: ({ locale, data }) => {
        const baseUrl = getServerSideURL();
        const lang = locale?.code || 'pt';

        return `${baseUrl}/${lang}/preview/projects/${data.slug}`;
      },
    },
  },
  defaultPopulate: {
    slug: true,
  },
  access: {
    admin: authenticated,
    read: anyone,
    create: authenticated,
    delete: authenticated,
    update: authenticated,
  },
  hooks: {
    afterRead: [sanitizeBrokenImageRelationship],
  },
  fields: [
    {
      type: 'tabs',
      label: 'Hawk Project Details',
      tabs: [
        HawkProjectPageTab,
        HawkProjectSeoTab,
        HawkProjectPartnersInformation,
        HawkProjectDisseminationFields,
      ],
    },
    /* -------------------------------------------------------------- */
    /*  ADMIN SECTION                                                 */
    /* -------------------------------------------------------------- */
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      admin: {
        description: {
          en: 'Unique slug used in the project page URL (e.g. "ai4youth"). Auto-generated from the title if left empty.',
          pt: 'Slug único usado no URL da página do projeto (ex: "ai4youth"). Gerado automaticamente a partir do título se ficar vazio.',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            data?.title?.replace(/\s+/g, '-').toLowerCase();
          },
        ],
      },
    },
    {
      name: 'actionType',
      label: { en: 'Action Type', pt: 'Tipo de Ação' },
      type: 'text',
      admin: {
        description: {
          en: 'e.g. KA152-YOU - Mobility of young people',
          pt: 'ex: KA152-YOU - Mobilidade de jovens',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'referenceNumber',
      label: { en: 'Reference Number', pt: 'Número de Referência' },
      type: 'text',
      admin: {
        description: {
          en: 'e.g. 2024-1-PT02-KA152-YOU-000232143',
          pt: 'ex: 2024-1-PT02-KA152-YOU-000232143',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'beneficiary',
      label: { en: 'Beneficiary', pt: 'Beneficiário' },
      type: 'text',
      admin: {
        description: { en: 'e.g. Hawk Stars (Portugal)', pt: 'ex: Hawk Stars (Portugal)' },
        position: 'sidebar',
      },
    },
    {
      name: 'location',
      label: { en: 'Location', pt: 'Localização' },
      type: 'text',
      localized: true,
      admin: {
        description: { en: 'e.g. Pinhel, Portugal', pt: 'ex: Pinhel, Portugal' },
        position: 'sidebar',
      },
    },
    {
      name: 'startDate',
      label: { en: 'Start Date', pt: 'Data de Início' },
      type: 'date',
      admin: {
        position: 'sidebar',
        description: { en: 'Start date of the project', pt: 'Data de início do projeto' },
      },
      required: false,
    },
    {
      name: 'endDate',
      label: { en: 'End Date', pt: 'Data de Fim' },
      type: 'date',
      admin: {
        position: 'sidebar',
        description: {
          en: 'End date of the project. Optional Value if it is just a single day for the project',
          pt: 'Data de fim do projeto. Valor opcional se for apenas um único dia.',
        },
      },
      required: false,
    },
    {
      name: 'infopack',
      label: { en: 'Infopack', pt: 'Infopack' },
      type: 'upload',
      relationTo: 'documents',
      required: false,
      admin: {
        position: 'sidebar',
        description: {
          en: 'Optional infopack document related to the project.',
          pt: 'Infopack opcional relacionado ao projeto.',
        },
      },
    },
    contentStatusField,
  ],
};
