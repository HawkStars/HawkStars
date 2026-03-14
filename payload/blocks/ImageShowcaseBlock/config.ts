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
    SectionID,
  ],
};
