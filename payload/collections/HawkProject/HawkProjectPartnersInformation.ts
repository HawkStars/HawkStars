import { Tab } from 'payload';

/* ------------------------------------------------------------------ */
/*  Dissemination link platform options                                */
/* ------------------------------------------------------------------ */
const disseminationPlatformOptions = [
  { label: { en: 'Facebook', pt: 'Facebook' }, value: 'facebook' },
  { label: { en: 'Instagram', pt: 'Instagram' }, value: 'instagram' },
  { label: { en: 'LinkedIn', pt: 'LinkedIn' }, value: 'linkedin' },
  { label: { en: 'YouTube', pt: 'YouTube' }, value: 'youtube' },
  { label: { en: 'TikTok', pt: 'TikTok' }, value: 'tiktok' },
  { label: { en: 'Website', pt: 'Website' }, value: 'website' },
  { label: { en: 'Other', pt: 'Outro' }, value: 'other' },
];

const HawkProjectPartnersInformation: Tab = {
  name: 'partnersInformation',
  label: { en: 'Partners', pt: 'Parceiros' },
  interfaceName: 'HawkProjectPartnersInformation',
  admin: {
    description:
      'Information about the project’s partners, including their names, roles, and contributions.',
  },
  fields: [
    {
      name: 'partners',
      label: { en: 'Partner Information', pt: 'Informação do Parceiro' },
      type: 'array',
      interfaceName: 'HawkProjectPartnerInformation',
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
          label: { en: 'Partners', pt: 'Parceiros' },
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
          label: { en: 'Role', pt: 'Papel' },
          type: 'select',
          options: [
            {
              label: { en: 'Hosting organisation', pt: 'Organização de Acolhimento' },
              value: 'hosting_org',
            },
            {
              label: { en: 'Sending organisation', pt: 'Organização de Envio' },
              value: 'sending_org',
            },
          ],
          admin: {
            description: 'Select the role of the partner organisation in this project',
          },
          defaultValue: 'sending_org',
        },
        {
          name: 'reports',
          label: { en: 'Official Reports', pt: 'Relatórios Oficiais' },
          type: 'array',
          interfaceName: 'HawkProjectPartnerReport',
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
              label: { en: 'Platform', pt: 'Plataforma' },
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
              label: { en: 'Button Label', pt: 'Rótulo do Botão' },
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
