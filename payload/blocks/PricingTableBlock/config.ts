import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const PricingTableBlock: Block = {
  slug: 'pricingTable',
  interfaceName: 'PricingTableBlock',
  admin: {
    group: 'CTA & Engagement',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: { en: 'Title', pt: 'Título' },
      admin: {
        description: { en: 'Section title', pt: 'Título da secção' },
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      label: { en: 'Subtitle', pt: 'Subtítulo' },
      admin: {
        description: {
          en: 'Section subtitle or description',
          pt: 'Subtítulo ou descrição da secção',
        },
      },
    },
    {
      name: 'tiers',
      type: 'array',
      interfaceName: 'PricingTableBlockTier',
      minRows: 1,
      maxRows: 4,
      label: { en: 'Tiers', pt: 'Níveis' },
      admin: {
        description: { en: 'Pricing tiers (up to 4)', pt: 'Níveis de preços (até 4)' },
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          localized: true,
          label: { en: 'Tier Name', pt: 'Nome do Nível' },
          admin: {
            description: {
              en: 'Tier name (e.g., "Bronze", "Silver", "Gold")',
              pt: 'Nome do nível (ex: "Bronze", "Prata", "Ouro")',
            },
          },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          label: { en: 'Price', pt: 'Preço' },
          admin: {
            description: { en: 'Price amount', pt: 'Valor do preço' },
          },
        },
        {
          name: 'currency',
          type: 'text',
          defaultValue: '€',
          label: { en: 'Currency', pt: 'Moeda' },
          admin: {
            description: { en: 'Currency symbol', pt: 'Símbolo de moeda' },
          },
        },
        {
          name: 'period',
          type: 'text',
          defaultValue: '/month',
          localized: true,
          label: { en: 'Period', pt: 'Período' },
          admin: {
            description: {
              en: 'Billing period (e.g., "/month", "/year", "one-time")',
              pt: 'Período de faturação (ex: "/mês", "/ano", "único")',
            },
          },
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          label: { en: 'Description', pt: 'Descrição' },
          admin: {
            description: {
              en: 'Brief description of this tier',
              pt: 'Descrição breve deste nível',
            },
          },
        },
        {
          name: 'features',
          type: 'array',
          interfaceName: 'PricingTableBlockTierFeature',
          label: { en: 'Features', pt: 'Funcionalidades' },
          fields: [
            {
              name: 'feature',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Feature', pt: 'Funcionalidade' },
            },
          ],
          admin: {
            description: {
              en: 'List of features included in this tier',
              pt: 'Lista de funcionalidades incluídas neste nível',
            },
            components: {
              RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
            },
          },
        },
        {
          name: 'buttonText',
          type: 'text',
          defaultValue: 'Choose Plan',
          localized: true,
          label: { en: 'Button Text', pt: 'Texto do Botão' },
          admin: {
            description: { en: 'CTA button text', pt: 'Texto do botão CTA' },
          },
        },
        {
          name: 'buttonLink',
          type: 'text',
          label: { en: 'Button Link', pt: 'Link do Botão' },
          admin: {
            description: { en: 'CTA button URL', pt: 'URL do botão CTA' },
          },
        },
        {
          name: 'highlighted',
          type: 'checkbox',
          defaultValue: false,
          label: { en: 'Highlighted', pt: 'Destacado' },
          admin: {
            description: {
              en: 'Mark this tier as featured/recommended',
              pt: 'Marcar este nível como destaque/recomendado',
            },
          },
        },
        {
          name: 'badge',
          type: 'text',
          label: { en: 'Badge', pt: 'Distintivo' },
          admin: {
            description: {
              en: 'Optional badge text (e.g., "Most Popular", "Best Value")',
              pt: 'Texto de distintivo opcional (ex: "Mais Popular", "Melhor Valor")',
            },
          },
        },
      ],
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Pricing Tables', pt: 'Tabelas de Preços' },
    singular: { en: 'Pricing Table', pt: 'Tabela de Preços' },
  },
};
