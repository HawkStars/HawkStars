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
            description: {
              en: 'Main heading text for this slide',
              pt: 'Texto do título principal para este diapositivo',
            },
          },
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: { en: 'Subtitle', pt: 'Subtítulo' },
          localized: true,
          admin: {
            description: {
              en: 'Subtitle or description text for this slide',
              pt: 'Texto do subtítulo ou descrição para este diapositivo',
            },
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
            description: {
              en: 'Text alignment for all slides',
              pt: 'Alinhamento do texto para todos os diapositivos',
            },
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
        description: {
          en: 'Overlay darkness for all slides (0-100%)',
          pt: 'Escuridão da sobreposição para todos os diapositivos (0-100%)',
        },
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: { en: 'Autoplay', pt: 'Reprodução Automática' },
      defaultValue: true,
      admin: {
        description: {
          en: 'Automatically cycle through slides',
          pt: 'Ciclar automaticamente pelos diapositivos',
        },
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
        description: {
          en: 'Time between slides in milliseconds (only if autoplay is enabled)',
          pt: 'Tempo entre diapositivos em milissegundos (apenas se a reprodução automática estiver ativada)',
        },
        condition: (_, siblingData) => siblingData?.autoplay === true,
      },
    },
    {
      name: 'showNavigation',
      type: 'checkbox',
      label: { en: 'Show Navigation', pt: 'Mostrar Navegação' },
      defaultValue: true,
      admin: {
        description: { en: 'Show previous/next arrows', pt: 'Mostrar setas de anterior/seguinte' },
      },
    },
    {
      name: 'showDots',
      type: 'checkbox',
      label: { en: 'Show Dots', pt: 'Mostrar Pontos' },
      defaultValue: true,
      admin: {
        description: { en: 'Show navigation dots', pt: 'Mostrar pontos de navegação' },
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
        description: { en: 'Height of the hero section', pt: 'Altura da secção hero' },
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Hero Slideshow Blocks', pt: 'Blocos de Slideshow Hero' },
    singular: { en: 'Hero Slideshow Block', pt: 'Bloco de Slideshow Hero' },
  },
};
