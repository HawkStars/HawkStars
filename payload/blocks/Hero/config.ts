import { PayloadImageField } from '@/payload/fields/ImageType';
import { link } from '@/payload/fields/link';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  admin: {
    group: 'Hero',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: { en: 'Badge', pt: 'Distintivo' },
      localized: true,
      admin: {
        description: 'Badge label above heading (e.g., "PLATFORM")',
      },
    },
    {
      name: 'heading',
      type: 'textarea',
      label: { en: 'Heading', pt: 'Título Principal' },
      required: true,
      localized: true,
      admin: {
        description: 'Main heading text',
      },
    },
    link({ name: 'ctaLink', description: 'Call-to-action button information' }),
    PayloadImageField({
      name: 'headerImage',
      label: 'Header Image',
      required: false,
      description: 'Image displayed above the heading',
    }),
    {
      name: 'features',
      type: 'array',
      label: { en: 'Features', pt: 'Funcionalidades' },
      interfaceName: 'HeroBlockFeature',
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: { en: 'Icon', pt: 'Ícone' },
          options: [
            { label: { en: 'Globe', pt: 'Globo' }, value: 'globe' },
            { label: { en: 'Rocket', pt: 'Foguetão' }, value: 'rocket' },
            { label: { en: 'Expand', pt: 'Expandir' }, value: 'expand' },
            { label: { en: 'Wrench', pt: 'Chave Inglesa' }, value: 'wrench' },
          ],
          required: true,
          admin: {
            description: 'Icon type for this feature',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: { en: 'Title', pt: 'Título' },
          required: true,
          localized: true,
          admin: {
            description: 'Feature title',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: { en: 'Description', pt: 'Descrição' },
          required: true,
          localized: true,
          admin: {
            description: 'Feature description',
          },
        },
      ],
      maxRows: 4,
      admin: {
        description: 'Feature cards displayed in grid (up to 4)',
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Hero Sections', pt: 'Secções Hero' },
    singular: { en: 'Hero Section', pt: 'Secção Hero' },
  },
};
