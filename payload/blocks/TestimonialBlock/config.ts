import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const TestimonialBlock: Block = {
  slug: 'testimonialBlock',
  interfaceName: 'TestimonialBlock',
  admin: {
    group: 'Social Proof',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: { en: 'Title', pt: 'Título' },
      admin: {
        description: 'Optional title for the testimonial section',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      label: { en: 'Subtitle', pt: 'Subtítulo' },
      admin: {
        description: 'Optional subtitle or description',
      },
    },
    {
      name: 'testimonials',
      type: 'array',
      interfaceName: 'TestimonialBlockItem',
      minRows: 1,
      required: true,
      label: { en: 'Testimonials', pt: 'Testemunhos' },
      admin: {
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          localized: true,
          label: { en: 'Quote', pt: 'Citação' },
          admin: {
            description: 'The testimonial quote or review',
          },
        },
        {
          name: 'author',
          type: 'group',
          label: { en: 'Author', pt: 'Autor' },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Name', pt: 'Nome' },
              admin: {
                description: 'Author full name',
              },
            },
            {
              name: 'title',
              type: 'text',
              localized: true,
              label: { en: 'Title', pt: 'Título' },
              admin: {
                description: 'Job title or role',
              },
            },
            {
              name: 'company',
              type: 'text',
              localized: true,
              label: { en: 'Company', pt: 'Empresa' },
              admin: {
                description: 'Company or organization',
              },
            },
            PayloadImageField({
              label: 'Avatar',
              name: 'avatar',
              required: false,
              description: 'Author profile photo',
            }),
          ],
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          label: { en: 'Rating', pt: 'Avaliação' },
          admin: {
            description: 'Star rating (1-5 stars)',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          label: { en: 'Featured', pt: 'Destaque' },
          admin: {
            description: 'Mark as featured testimonial (larger display)',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      label: { en: 'Layout', pt: 'Disposição' },
      options: [
        {
          label: { en: 'Single Column', pt: 'Coluna Única' },
          value: 'single',
        },
        {
          label: { en: 'Two Columns', pt: 'Duas Colunas' },
          value: 'two-cols',
        },
        {
          label: { en: 'Three Columns', pt: 'Três Colunas' },
          value: 'three-cols',
        },
        {
          label: { en: 'Carousel', pt: 'Carrossel' },
          value: 'carousel',
        },
        {
          label: { en: 'Masonry', pt: 'Mosaico' },
          value: 'masonry',
        },
      ],
      defaultValue: 'three-cols',
      admin: {
        description: 'How to display the testimonials',
      },
    },
    {
      name: 'style',
      type: 'select',
      label: { en: 'Style', pt: 'Estilo' },
      options: [
        {
          label: { en: 'Card Style', pt: 'Estilo Cartão' },
          value: 'card',
        },
        {
          label: { en: 'Quote Style', pt: 'Estilo Citação' },
          value: 'quote',
        },
        {
          label: { en: 'Minimal', pt: 'Minimalista' },
          value: 'minimal',
        },
        {
          label: { en: 'Bubble', pt: 'Balão' },
          value: 'bubble',
        },
      ],
      defaultValue: 'card',
      admin: {
        description: 'Visual style of testimonials',
      },
    },
    {
      name: 'showRatings',
      type: 'checkbox',
      defaultValue: true,
      label: { en: 'Show Ratings', pt: 'Mostrar Avaliações' },
      admin: {
        description: 'Display star ratings',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: { en: 'Background Color', pt: 'Cor de Fundo' },
      options: [
        {
          label: { en: 'None (transparent)', pt: 'Nenhuma (transparente)' },
          value: 'none',
        },
        {
          label: { en: 'Light Gray', pt: 'Cinzento Claro' },
          value: 'light-gray',
        },
        {
          label: { en: 'Dark', pt: 'Escuro' },
          value: 'dark',
        },
        {
          label: { en: 'Brand Color', pt: 'Cor da Marca' },
          value: 'brand',
        },
      ],
      defaultValue: 'none',
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Testimonial Blocks', pt: 'Blocos de Testemunho' },
    singular: { en: 'Testimonial Block', pt: 'Bloco de Testemunho' },
  },
};
