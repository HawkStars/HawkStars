import type { Block } from 'payload';

export const ImageComparisonSliderBlock: Block = {
  slug: 'imageComparisonSlider',
  interfaceName: 'ImageComparisonSliderBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'beforeImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Before image',
      },
    },
    {
      name: 'afterImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'After image',
      },
    },
    {
      name: 'beforeLabel',
      type: 'text',
      defaultValue: 'Before',
    },
    {
      name: 'afterLabel',
      type: 'text',
      defaultValue: 'After',
    },
  ],
  labels: {
    plural: 'Image Comparison Sliders',
    singular: 'Image Comparison Slider',
  },
};
