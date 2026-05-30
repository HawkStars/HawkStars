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
      description: {
        en: 'Background image for the hero section',
        pt: 'Imagem de fundo para a secção hero',
      },
    }),
    {
      name: 'title',
      type: 'textarea',
      label: { en: 'Title', pt: 'Título' },
      required: true,
      localized: true,
      admin: {
        description: { en: 'Main heading text', pt: 'Texto do título principal' },
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: { en: 'Subtitle', pt: 'Subtítulo' },
      localized: true,
      admin: {
        description: { en: 'Subtitle or description text', pt: 'Texto do subtítulo ou descrição' },
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
        description: { en: 'Overlay darkness (0-100%)', pt: 'Escuridão da sobreposição (0-100%)' },
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
        description: { en: 'Text alignment', pt: 'Alinhamento do texto' },
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Hero with Background Image Sections', pt: 'Secções Hero com Imagem de Fundo' },
    singular: { en: 'Hero with Background Image Section', pt: 'Secção Hero com Imagem de Fundo' },
  },
};
