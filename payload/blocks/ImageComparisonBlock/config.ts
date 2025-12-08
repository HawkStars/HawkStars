import { PayloadImageField } from '@/payload/fields/ImageType';
import type { Block } from 'payload';

export const ImageComparisonBlock: Block = {
  slug: 'imageComparison',
  labels: {
    singular: 'Image Comparison',
    plural: 'Image Comparisons',
  },
  fields: [
    PayloadImageField({ label: 'Before Image', name: 'beforeImage' }),
    PayloadImageField({ label: 'After Image', name: 'afterImage' }),
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'initialSliderPosition',
      type: 'number',
      label: 'Initial Slider Position (%)',
      defaultValue: 50,
      min: 0,
      max: 100,
      admin: {
        description: 'Position of the comparison slider on load (0-100%)',
      },
    },
  ],
};
