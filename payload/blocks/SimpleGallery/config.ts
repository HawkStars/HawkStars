import SectionID from '@/payload/fields/SectionID';
import { Block } from 'payload';

const SimpleGallery: Block = {
  slug: 'simpleGallery',
  labels: {
    singular: 'Simple Gallery',
    plural: 'Simple Galleries',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Gallery Title',
      required: false,
      defaultValue: 'Beautiful Interiors.',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Gallery Description',
      required: false,
      defaultValue:
        'Explore our curated collection of stunning interior designs.\nEach space tells a unique story through thoughtful design and attention to detail.',
    },
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
    SectionID,
  ],
};

export default SimpleGallery;
