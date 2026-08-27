import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

/**
 * Categorized price/reward catalog. Unlike `PricingTableBlock` (capped at 4
 * SaaS-style plan cards), this supports an arbitrary number of grouped rows —
 * e.g. a naming-rights ladder (Brick Wall, Naming Rooms, Exclusive Brand
 * Deal…) or a donation-experiences menu (Pinhel City, Rewilding Portugal,
 * Educação…). Price is a free-text field so values like "Desde 250 €" or
 * "550 € / com alojamento 770 €" are representable, not just plain numbers.
 */
export const OfferCatalogBlock: Block = {
  slug: 'offerCatalog',
  interfaceName: 'OfferCatalogBlock',
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
          en: 'Optional section subtitle or description',
          pt: 'Subtítulo ou descrição opcional da secção',
        },
      },
    },
    {
      name: 'background',
      type: 'select',
      required: true,
      defaultValue: 'white',
      label: { en: 'Background', pt: 'Fundo' },
      options: [
        { label: { en: 'White', pt: 'Branco' }, value: 'white' },
        { label: { en: 'Beige', pt: 'Bege' }, value: 'bege' },
        { label: { en: 'Green', pt: 'Verde' }, value: 'green' },
      ],
      admin: {
        description: { en: 'Background color for the section', pt: 'Cor de fundo da secção' },
      },
    },
    {
      name: 'groups',
      type: 'array',
      interfaceName: 'OfferCatalogGroup',
      required: true,
      minRows: 1,
      label: { en: 'Groups', pt: 'Grupos' },
      labels: {
        singular: { en: 'Group', pt: 'Grupo' },
        plural: { en: 'Groups', pt: 'Grupos' },
      },
      admin: {
        description: {
          en: 'Categories of offers (e.g. "Naming Walls", "Rewilding Portugal")',
          pt: 'Categorias de ofertas (ex: "Naming Walls", "Rewilding Portugal")',
        },
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      fields: [
        {
          name: 'groupLabel',
          type: 'text',
          required: true,
          localized: true,
          label: { en: 'Group Label', pt: 'Nome do Grupo' },
        },
        {
          name: 'items',
          type: 'array',
          interfaceName: 'OfferCatalogItem',
          required: true,
          minRows: 1,
          label: { en: 'Items', pt: 'Itens' },
          labels: {
            singular: { en: 'Item', pt: 'Item' },
            plural: { en: 'Items', pt: 'Itens' },
          },
          admin: {
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
              label: { en: 'Name', pt: 'Nome' },
              admin: {
                description: {
                  en: 'e.g. "Sala de Formação 1", "Pacote 2 dias casal"',
                  pt: 'ex: "Sala de Formação 1", "Pacote 2 dias casal"',
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
                  en: 'Optional extra detail (e.g. size options, what is included)',
                  pt: 'Detalhe extra opcional (ex: opções de tamanho, o que está incluído)',
                },
              },
            },
            {
              name: 'price',
              type: 'text',
              required: true,
              label: { en: 'Price / Value', pt: 'Preço / Valor' },
              admin: {
                description: {
                  en: 'Free text so ranges/prefixes work, e.g. "Desde 250 €", "40.000 €"',
                  pt: 'Texto livre para permitir intervalos/prefixos, ex: "Desde 250 €", "40.000 €"',
                },
              },
            },
            {
              name: 'badge',
              type: 'text',
              localized: true,
              label: { en: 'Badge', pt: 'Distintivo' },
              admin: {
                description: {
                  en: 'Optional badge text (e.g. "Exclusivo", "Mais Popular")',
                  pt: 'Texto de distintivo opcional (ex: "Exclusivo", "Mais Popular")',
                },
              },
            },
          ],
        },
      ],
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Offer Catalogs', pt: 'Catálogos de Ofertas' },
    singular: { en: 'Offer Catalog', pt: 'Catálogo de Ofertas' },
  },
};
