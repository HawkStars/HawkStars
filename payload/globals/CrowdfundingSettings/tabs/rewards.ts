import { Tab } from 'payload';

const CrowdfundingSettingsRewardsTab: Tab = {
  label: { pt: 'Rewards', en: 'Rewards' },
  description: {
    pt: 'Configure os tiers e itens de reward mostrados na secção "Rewards e Modalidades".',
    en: 'Configure the reward tiers and items shown in the "Rewards & Tiers" section.',
  },
  fields: [
    {
      name: 'rewardTiers',
      type: 'array',
      interfaceName: 'CrowdfundingRewardTier',
      label: {
        pt: 'Tiers de Rewards',
        en: 'Reward Tiers',
      },
      admin: {
        description: {
          en: 'Reward tiers displayed as cards in the Rewards section. Add one per tier, in order.',
          pt: 'Níveis de recompensa exibidos como cartões na secção de Rewards. Adicione um por nível, por ordem.',
        },
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      maxRows: 10,
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: {
            pt: 'Título',
            en: 'Title',
          },
          required: true,
          admin: {
            description: {
              en: 'E.g. "Apoios Simples", "Reconhecimento no Espaço".',
              pt: 'Ex: "Apoios Simples", "Reconhecimento no Espaço".',
            },
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          localized: true,
          label: {
            pt: 'Subtítulo',
            en: 'Subtitle',
          },
          admin: {
            description: {
              en: 'Short tagline below the title (e.g. "Pequenos gestos, grande impacto.").',
              pt: 'Slogan curto abaixo do título (ex: "Pequenos gestos, grande impacto.").',
            },
          },
        },
        {
          name: 'icon',
          type: 'select',
          label: {
            pt: 'Ícone',
            en: 'Icon',
          },
          defaultValue: 'heart',
          options: [
            { label: { pt: 'Coração', en: 'Heart' }, value: 'heart' },
            { label: { pt: 'Edifício', en: 'Building' }, value: 'building' },
            { label: { pt: 'Localização', en: 'Location' }, value: 'location' },
            { label: { pt: 'Troféu', en: 'Trophy' }, value: 'trophy' },
          ],
        },
        {
          name: 'items',
          type: 'array',
          interfaceName: 'CrowdfundingRewardItem',
          label: {
            pt: 'Itens',
            en: 'Items',
          },
          admin: {
            description: {
              en: 'Reward items within this tier.',
              pt: 'Itens de recompensa neste nível.',
            },
            components: {
              RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
            },
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              localized: true,
              label: {
                pt: 'Descrição',
                en: 'Label',
              },
              required: true,
              admin: {
                description: {
                  en: 'E.g. "Agradecimento digital", "T-shirt de doador".',
                  pt: 'Ex: "Agradecimento digital", "T-shirt de doador".',
                },
              },
            },
            {
              name: 'price',
              type: 'text',
              localized: true,
              label: {
                pt: 'Preço',
                en: 'Price',
              },
              admin: {
                description: {
                  en: 'E.g. "Desde 10€", "250€ / 350€". Leave empty if not applicable.',
                  pt: 'Ex: "Desde 10€", "250€ / 350€". Deixe vazio se não aplicável.',
                },
              },
            },
          ],
        },
      ],
    },
  ],
};

export default CrowdfundingSettingsRewardsTab;
