import { GroupField } from 'payload';

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

const HawkProjectPartnersInformation: GroupField = {
  name: 'partnersInfo',
  label: 'Partners Information',
  type: 'group',
  admin: {
    description:
      "Information about the project's partners, including their names, roles, and contributions.",
  },
  fields: [
    {
      name: 'projectPartners',
      label: 'Partners',
      type: 'relationship',
      relationTo: 'partners',
      admin: {
        description:
          'Select partner organisations for this project. They will be grouped by country automatically.',
      },
    },
    {
      name: 'reports',
      label: 'Official Reports',
      type: 'array',
      fields: [
        {
          name: 'platform',
          label: 'Platform',
          type: 'select',
          required: true,
          options: disseminationPlatformOptions,
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required: true,
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
};

export default HawkProjectPartnersInformation;
