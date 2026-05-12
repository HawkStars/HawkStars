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

export const HawkProject: CollectionConfig = {
  slug: 'hawk_projects',
  labels: {
    singular: 'Hawk Project',
    plural: 'Hawk Projects',
  },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['hero', 'slug', 'startDate'],
    description:
      'Manage HawkStars projects and events. Add project details, images, and descriptions. Each project gets its own public page based on its slug.',
    group: {
      name: 'Daily Work',
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
        description:
          'Unique slug used in the project page URL (e.g. "ai4youth"). Auto-generated from the title if left empty.',
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
      label: 'Action Type',
      type: 'text',
      admin: {
        description: 'e.g. KA152-YOU - Mobility of young people',
        position: 'sidebar',
      },
    },
    {
      name: 'referenceNumber',
      label: 'Reference Number',
      type: 'text',
      admin: {
        description: 'e.g. 2024-1-PT02-KA152-YOU-000232143',
        position: 'sidebar',
      },
    },
    {
      name: 'beneficiary',
      label: 'Beneficiary',
      type: 'text',
      admin: {
        description: 'e.g. Hawk Stars (Portugal)',
        position: 'sidebar',
      },
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      localized: true,
      admin: {
        description: 'e.g. Pinhel, Portugal',
        position: 'sidebar',
      },
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      admin: { position: 'sidebar', description: 'Start date of the project' },
      required: false,
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      admin: {
        position: 'sidebar',
        description:
          'End date of the project. Optional Value if it is just a single day for the project',
      },
      required: false,
    },
    contentStatusField,
  ],
};
