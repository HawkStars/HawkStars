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
        description: {
          en: 'Badge label above heading (e.g., "PLATFORM")',
          pt: 'Rótulo do distintivo acima do título (ex: "PLATAFORMA")',
        },
      },
    },
    {
      name: 'headingLevel',
      type: 'select',
      label: { en: 'Heading level', pt: 'Nível do título' },
      defaultValue: 'h1',
      options: [
        { label: 'H1 (page title)', value: 'h1' },
        { label: 'H2 (secondary section)', value: 'h2' },
      ],
      admin: {
        description: {
          en: 'Leave as H1 unless another hero on this page is already the page title — a page must have exactly one H1 (AUDIT.md A11Y-M3).',
          pt: 'Deixe H1 a menos que outro hero nesta página já seja o título — uma página deve ter exatamente um H1 (AUDIT.md A11Y-M3).',
        },
      },
    },
    {
      name: 'heading',
      type: 'textarea',
      label: { en: 'Heading', pt: 'Título Principal' },
      required: true,
      localized: true,
      admin: {
        description: { en: 'Main heading text', pt: 'Texto do título principal' },
      },
    },
    link({ name: 'ctaLink', description: 'Call-to-action button information' }),
    PayloadImageField({
      name: 'headerImage',
      label: 'Header Image',
      required: false,
      description: {
        en: 'Image displayed above the heading',
        pt: 'Imagem exibida acima do título',
      },
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
            description: {
              en: 'Icon type for this feature',
              pt: 'Tipo de ícone para esta funcionalidade',
            },
          },
        },
        {
          name: 'title',
          type: 'text',
          label: { en: 'Title', pt: 'Título' },
          required: true,
          localized: true,
          admin: {
            description: { en: 'Feature title', pt: 'Título da funcionalidade' },
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: { en: 'Description', pt: 'Descrição' },
          required: true,
          localized: true,
          admin: {
            description: { en: 'Feature description', pt: 'Descrição da funcionalidade' },
          },
        },
      ],
      maxRows: 4,
      admin: {
        description: {
          en: 'Feature cards displayed in grid (up to 4)',
          pt: 'Cartões de funcionalidades exibidos em grelha (até 4)',
        },
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
