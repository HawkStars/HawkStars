import { PayloadImageField } from '@/payload/fields/ImageType';
import { linkGroup } from '@/payload/fields/linkGroup';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const HeroWithBackgroundImage: Block = {
  slug: 'heroWithBackgroundImage',
  interfaceName: 'HeroWithBackgroundImageBlock',
  admin: {
    group: 'Hero',
  },
  fields: [
    PayloadImageField({
      name: 'backgroundImage',
      label: 'Background Image',
      required: true,
      description: 'Background image for the hero section',
    }),
    {
      name: 'title',
      type: 'textarea',
      label: { en: 'Title', pt: 'Título' },
      required: true,
      localized: true,
      admin: {
        description: 'Main heading text',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: { en: 'Subtitle', pt: 'Subtítulo' },
      localized: true,
      admin: {
        description: 'Subtitle or description text',
      },
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      label: { en: 'Overlay Opacity', pt: 'Opacidade da Sobreposição' },
      min: 0,
      max: 100,
      defaultValue: 50,
      admin: {
        description: 'Overlay darkness (0-100%)',
      },
    },
    linkGroup({ overrides: { maxRows: 2 } }),
    {
      name: 'textAlignment',
      type: 'select',
      label: { en: 'Text Alignment', pt: 'Alinhamento do Texto' },
      options: [
        { label: { en: 'Left', pt: 'Esquerda' }, value: 'left' },
        { label: { en: 'Center', pt: 'Centro' }, value: 'center' },
        { label: { en: 'Right', pt: 'Direita' }, value: 'right' },
      ],
      defaultValue: 'center',
      admin: {
        description: 'Text alignment',
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Hero with Background Image Sections', pt: 'Secções Hero com Imagem de Fundo' },
    singular: { en: 'Hero with Background Image Section', pt: 'Secção Hero com Imagem de Fundo' },
  },
};
