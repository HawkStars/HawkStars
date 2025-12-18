import SectionID from '@/payload/fields/SectionID';
import { Block } from 'payload';

const MultiRowImage: Block = {
  slug: 'multiRowImage',
  labels: {
    singular: 'Multi Row Image',
    plural: 'Multi Row Images',
  },
  fields: [
    {
      name: 'rows',
      type: 'array',
      label: 'Image Rows',
      required: true,
      fields: [
        {
          name: 'images',
          type: 'array',
          label: 'Images',
          required: true,
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Image',
            },
            {
              name: 'alt',
              type: 'text',
              label: 'Alt Text',
              required: false,
            },
          ],
        },
      ],
    },
    {
      name: 'rowGap',
      type: 'number',
      label: 'Row Gap (px)',
      required: false,
      defaultValue: 24,
    },
    {
      name: 'imageGap',
      type: 'number',
      label: 'Image Gap (px)',
      required: false,
      defaultValue: 16,
    },
    SectionID,
  ],
};

export default MultiRowImage;
