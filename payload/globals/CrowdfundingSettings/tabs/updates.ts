import { Tab } from 'payload';

const CrowdfundingSettingsUpdatesTab: Tab = {
  label: { pt: 'Atualizações', en: 'Updates' },
  description: {
    pt: 'Cartões de atualizações da campanha, mostrados na secção "Atualizações da Campanha".',
    en: 'Campaign update cards shown in the "Campaign Updates" section.',
  },
  fields: [
    {
      name: 'updateCards',
      type: 'array',
      interfaceName: 'CrowdfundingUpdateCard',
      label: {
        pt: 'Cartões de Atualizações',
        en: 'Update Cards',
      },
      admin: {
        description: {
          en: 'Campaign update cards shown in the Updates section. Each card links to an Instagram post.',
          pt: 'Cartões de atualização da campanha mostrados na secção de Atualizações. Cada cartão liga a uma publicação do Instagram.',
        },
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: {
            pt: 'Imagem',
            en: 'Image',
          },
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: {
            pt: 'Título',
            en: 'Title',
          },
          required: true,
        },
        {
          name: 'date',
          type: 'date',
          label: {
            pt: 'Data',
            en: 'Date',
          },
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd MMM yyyy',
            },
          },
        },
        {
          name: 'instagramUrl',
          type: 'text',
          label: {
            pt: 'URL do Instagram',
            en: 'Instagram URL',
          },
          admin: {
            description: {
              en: 'Link to the Instagram post for this update (e.g. "https://www.instagram.com/p/...").',
              pt: 'Link para a publicação do Instagram desta atualização (ex: "https://www.instagram.com/p/...").',
            },
          },
        },
      ],
    },
  ],
};

export default CrowdfundingSettingsUpdatesTab;
