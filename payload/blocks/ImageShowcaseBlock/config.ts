import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const ImageShowcaseBlock: Block = {
  slug: 'imageShowcase',
  interfaceName: 'ImageShowcaseBlock',
  labels: {
    singular: 'Image Showcase',
    plural: 'Image Showcases',
  },
  fields: [
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      required: true,
      minRows: 2,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [PayloadImageField({ label: 'Image', name: 'image', required: true })],
    },
    {
      name: 'transitionDuration',
      type: 'number',
      label: 'Transition Duration (ms)',
      defaultValue: 5000,
      min: 1000,
      max: 30000,
      admin: {
        description:
          'Time in milliseconds for each image to transition from grayscale to color (default: 5000ms)',
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Autoplay',
      defaultValue: true,
      admin: {
        description: 'Whether the image showcase should automatically transition between images.',
      },
    },
    {
      name: 'gridColumns',
      type: 'select',
      label: 'Grid Columns',
      defaultValue: '2',
      options: [
        { label: '1 Column', value: '1' },
        { label: '2 Columns', value: '2' },
      ],
      admin: {
        description:
          'Number of columns to display in the thumbnail grid (default: 2). Note: For best results, use images with a 1:1 aspect ratio.',
      },
    },
    SectionID,
  ],
};
