import { Tab } from 'payload';

/* ------------------------------------------------------------------ */
/*  Dissemination link platform options                                */
/* ------------------------------------------------------------------ */
const disseminationPlatformOptions = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Website', value: 'website' },
  { label: 'Other', value: 'other' },
];

const HawkProjectPartnersInformation: Tab = {
  name: 'partnersInformation',
  label: 'Partners',
  interfaceName: 'HawkProjectPartnersInformation',
  admin: {
    description:
      "Information about the project's partners, including their names, roles, and contributions.",
  },
  fields: [
    {
      name: 'partners',
      label: 'Partner Information',
      type: 'array',
      admin: {
        description: 'List of partner organizations involved in the project',
        initCollapsed: true,
        components: {
          RowLabel: '@/payload/collections/HawkProject/components/partners/PartnersRowLabel',
        },
      },
      fields: [
        {
          name: 'partner',
          label: 'Partners',
          type: 'relationship',
          relationTo: 'partners',
          required: true,
          admin: {
            description:
              'Select partner organisations for this project. They will be grouped by country automatically.',
          },
        },
        {
          name: 'role',
          label: 'Role',
          type: 'select',
          options: [
            { label: 'Hosting organisation', value: 'hosting_org' },
            { label: 'Sending organisation', value: 'sending_org' },
          ],
          admin: {
            description: 'Select the role of the partner organisation in this project',
          },
          defaultValue: 'sending_org',
        },
        {
          name: 'reports',
          label: 'Official Reports',
          type: 'array',
          admin: {
            description: 'Official reports related to this partner (Salto, Project Report, etc.)',
            initCollapsed: true,
            components: {
              RowLabel: '@/payload/collections/HawkProject/components/partners/ReportsRowLabel',
            },
          },
          fields: [
            {
              name: 'platform',
              label: 'Platform',
              type: 'select',
              required: true,
              options: disseminationPlatformOptions,
              admin: {
                description: 'Select the platform where the partner disseminated project results',
              },
            },
            {
              name: 'url',
              label: 'URL',
              type: 'text',
              required: true,
              admin: {
                description: 'Link to the partner’s report or dissemination page',
              },
            },
            {
              name: 'label',
              label: 'Button Label',
              type: 'text',
              localized: true,
              admin: {
                description:
                  'e.g. "Disseminação via Facebook" — if empty, auto-generated from platform',
              },
            },
          ],
        },
      ],
    },
  ],
};

export default HawkProjectPartnersInformation;
