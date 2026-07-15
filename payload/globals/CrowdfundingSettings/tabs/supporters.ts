import { Tab } from 'payload';

export const CrowdfundingSettingsSupportersTab: Tab = {
  label: 'Supporters',
  fields: [
    {
      name: 'supporters',
      type: 'array',
      interfaceName: 'CrowdfundingSupporter',
      label: {
        pt: 'Apoiantes',
        en: 'Supporters',
      },
      admin: {
        description: {
          en: 'People and entities that support the project. Shown in the "Já Contamos com o Apoio de" section.',
          pt: 'Pessoas e entidades que apoiam o projeto. Mostradas na secção "Já Contamos com o Apoio de".',
        },
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: {
            pt: 'Nome',
            en: 'Name',
          },
          required: true,
        },
        {
          name: 'subname',
          type: 'text',
          label: {
            pt: 'Subtítulo',
            en: 'Subtitle',
          },
          admin: {
            description: {
              en: 'Role, title, or short description (e.g. "Município de Pinhel").',
              pt: 'Função, título ou descrição curta (ex: "Município de Pinhel").',
            },
          },
        },
        {
          name: 'type',
          type: 'select',
          label: {
            pt: 'Tipo',
            en: 'Type',
          },
          options: [
            { label: { pt: 'Pessoa', en: 'Person' }, value: 'person' },
            { label: { pt: 'Entidade', en: 'Entity' }, value: 'entity' },
          ],
          defaultValue: 'entity',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: {
            pt: 'Logo / Foto',
            en: 'Logo / Photo',
          },
          admin: {
            description: {
              en: 'Optional logo or photo. If empty, the name initials will be shown.',
              pt: 'Logótipo ou foto opcional. Se vazio, serão mostradas as iniciais do nome.',
            },
          },
        },
      ],
    },
  ],
};
