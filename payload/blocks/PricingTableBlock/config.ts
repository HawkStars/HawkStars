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
        description: 'Section title',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      label: { en: 'Subtitle', pt: 'Subtítulo' },
      admin: {
        description: 'Section subtitle or description',
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
        description: 'Pricing tiers (up to 4)',
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
            description: 'Tier name (e.g., "Bronze", "Silver", "Gold")',
          },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          label: { en: 'Price', pt: 'Preço' },
          admin: {
            description: 'Price amount',
          },
        },
        {
          name: 'currency',
          type: 'text',
          defaultValue: '€',
          label: { en: 'Currency', pt: 'Moeda' },
          admin: {
            description: 'Currency symbol',
          },
        },
        {
          name: 'period',
          type: 'text',
          defaultValue: '/month',
          localized: true,
          label: { en: 'Period', pt: 'Período' },
          admin: {
            description: 'Billing period (e.g., "/month", "/year", "one-time")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          label: { en: 'Description', pt: 'Descrição' },
          admin: {
            description: 'Brief description of this tier',
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
            description: 'List of features included in this tier',
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
            description: 'CTA button text',
          },
        },
        {
          name: 'buttonLink',
          type: 'text',
          label: { en: 'Button Link', pt: 'Link do Botão' },
          admin: {
            description: 'CTA button URL',
          },
        },
        {
          name: 'highlighted',
          type: 'checkbox',
          defaultValue: false,
          label: { en: 'Highlighted', pt: 'Destacado' },
          admin: {
            description: 'Mark this tier as featured/recommended',
          },
        },
        {
          name: 'badge',
          type: 'text',
          label: { en: 'Badge', pt: 'Distintivo' },
          admin: {
            description: 'Optional badge text (e.g., "Most Popular", "Best Value")',
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
