import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const ImageComparisonSliderBlock: Block = {
  slug: 'imageComparisonSlider',
  interfaceName: 'ImageComparisonSliderBlock',
  admin: {
    group: 'Media',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Title', pt: 'Título' },
      localized: true,
    },
    PayloadImageField({
      label: 'Before Image',
      name: 'beforeImage',
      required: true,
      description: { en: 'Image shown on the left side', pt: 'Imagem mostrada no lado esquerdo' },
    }),
    PayloadImageField({
      label: 'After Image',
      name: 'afterImage',
      required: true,
      description: { en: 'Image shown on the right side', pt: 'Imagem mostrada no lado direito' },
    }),
    {
      name: 'beforeLabel',
      type: 'text',
      label: { en: 'Before Label', pt: 'Rótulo Antes' },
      defaultValue: 'Before',
      localized: true,
      admin: {
        description: { en: 'Label for the before image', pt: 'Rótulo para a imagem "antes"' },
      },
      required: false,
    },
    {
      name: 'afterLabel',
      type: 'text',
      label: { en: 'After Label', pt: 'Rótulo Depois' },
      defaultValue: 'After',
      localized: true,
      admin: {
        description: { en: 'Label for the after image', pt: 'Rótulo para a imagem "depois"' },
      },
      required: false,
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Image Comparison Sliders', pt: 'Comparadores de Imagem' },
    singular: { en: 'Image Comparison Slider', pt: 'Comparador de Imagem' },
  },
};
