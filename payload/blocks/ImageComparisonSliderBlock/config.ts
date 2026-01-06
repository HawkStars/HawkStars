import SectionID from '@/payload/fields/SectionID';
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
      admin: {
        description: 'Label for the before image',
      },
      required: false,
    },
    {
      name: 'afterLabel',
      type: 'text',
      defaultValue: 'After',
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
