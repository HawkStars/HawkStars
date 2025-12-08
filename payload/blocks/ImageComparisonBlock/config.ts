import type { Block } from 'payload';

export const ImageComparisonBlock: Block = {
  slug: 'imageComparison',
  labels: {
    singular: 'Image Comparison',
    plural: 'Image Comparisons',
  },
  fields: [
    {
      name: 'beforeImageType',
      type: 'select',
      label: 'Before Image Type',
      options: [
        { label: 'External Image', value: 'external' },
        { label: 'Uploaded Image', value: 'upload' },
      ],
    },
    {
      name: 'beforeImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Before Image',
    },
    {
      name: 'afterImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'After Image',
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: 'Title',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Description',
    },
    {
      name: 'beforeLabel',
      type: 'text',
      localized: true,
      label: 'Before Label',
      defaultValue: 'Before',
    },
    {
      name: 'afterLabel',
      type: 'text',
      localized: true,
      label: 'After Label',
      defaultValue: 'After',
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
