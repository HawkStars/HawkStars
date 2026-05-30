import { PayloadImageField } from '@/payload/fields/ImageType';
import { linkGroup } from '@/payload/fields/linkGroup';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const HeroSlideshowBlock: Block = {
  slug: 'heroSlideshowBlock',
  interfaceName: 'HeroSlideshowBlock',
  admin: {
    group: 'Hero',
  },
  fields: [
    {
      name: 'slides',
      type: 'array',
      label: { en: 'Slides', pt: 'Diapositivos' },
      minRows: 1,
      required: true,
      labels: {
        singular: { en: 'Slide', pt: 'Diapositivo' },
        plural: { en: 'Slides', pt: 'Diapositivos' },
      },
      fields: [
        PayloadImageField({ name: 'backgroundImage', label: 'Background Image' }),
        {
          name: 'title',
          type: 'textarea',
          label: { en: 'Title', pt: 'Título' },
          localized: true,
          admin: {
            description: 'Main heading text for this slide',
          },
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: { en: 'Subtitle', pt: 'Subtítulo' },
          localized: true,
          admin: {
            description: 'Subtitle or description text for this slide',
          },
        },
        linkGroup({ overrides: { maxRows: 2 } }),
        {
          name: 'textAlignment',
          type: 'select',
          label: { en: 'Text Alignment', pt: 'Alinhamento do Texto' },
          required: true,
          options: [
            { label: { en: 'Left', pt: 'Esquerda' }, value: 'left' },
            { label: { en: 'Center', pt: 'Centro' }, value: 'center' },
            { label: { en: 'Right', pt: 'Direita' }, value: 'right' },
          ],
          defaultValue: 'center',
          admin: {
            description: 'Text alignment for all slides',
          },
        },
      ],
      admin: {
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      interfaceName: 'HeroSlideshowBlockSlide',
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      label: { en: 'Overlay Opacity', pt: 'Opacidade da Sobreposição' },
      min: 0,
      max: 100,
      defaultValue: 40,
      admin: {
        description: 'Overlay darkness for all slides (0-100%)',
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: { en: 'Autoplay', pt: 'Reprodução Automática' },
      defaultValue: true,
      admin: {
        description: 'Automatically cycle through slides',
      },
    },
    {
      name: 'autoplayInterval',
      type: 'number',
      label: { en: 'Autoplay Interval', pt: 'Intervalo de Reprodução' },
      min: 2000,
      max: 15000,
      defaultValue: 5000,
      admin: {
        description: 'Time between slides in milliseconds (only if autoplay is enabled)',
        condition: (_, siblingData) => siblingData?.autoplay === true,
      },
    },
    {
      name: 'showNavigation',
      type: 'checkbox',
      label: { en: 'Show Navigation', pt: 'Mostrar Navegação' },
      defaultValue: true,
      admin: {
        description: 'Show previous/next arrows',
      },
    },
    {
      name: 'showDots',
      type: 'checkbox',
      label: { en: 'Show Dots', pt: 'Mostrar Pontos' },
      defaultValue: true,
      admin: {
        description: 'Show navigation dots',
      },
    },
    {
      name: 'height',
      type: 'select',
      label: { en: 'Height', pt: 'Altura' },
      options: [
        { label: { en: 'Full Screen', pt: 'Ecrã Inteiro' }, value: 'fullscreen' },
        { label: { en: 'Large (700px)', pt: 'Grande (700px)' }, value: 'large' },
        { label: { en: 'Medium (500px)', pt: 'Médio (500px)' }, value: 'medium' },
        { label: { en: 'Small (400px)', pt: 'Pequeno (400px)' }, value: 'small' },
      ],
      defaultValue: 'large',
      admin: {
        description: 'Height of the hero section',
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Hero Slideshow Blocks', pt: 'Blocos de Slideshow Hero' },
    singular: { en: 'Hero Slideshow Block', pt: 'Bloco de Slideshow Hero' },
  },
};
