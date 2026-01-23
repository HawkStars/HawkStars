import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const ImageComparisonSliderBlock: Block = {
  slug: 'imageComparisonSlider',
  interfaceName: 'ImageComparisonSliderBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    PayloadImageField({
      label: 'Before Image',
      name: 'beforeImage',
      required: true,
      description: 'Image shown on the left side',
    }),
    PayloadImageField({
      label: 'After Image',
      name: 'afterImage',
      required: true,
      description: 'Image shown on the right side',
    }),
    {
      name: 'beforeLabel',
      type: 'text',
      defaultValue: 'Before',
      localized: true,
      admin: {
        description: 'Label for the before image',
      },
      required: false,
    },
    {
      name: 'afterLabel',
      type: 'text',
      defaultValue: 'After',
      localized: true,
      admin: {
        description: 'Label for the after image',
      },
      required: false,
    },
    SectionID,
  ],
  labels: {
    plural: 'Image Comparison Sliders',
    singular: 'Image Comparison Slider',
  },
};
