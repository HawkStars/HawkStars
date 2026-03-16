import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import { Block } from 'payload';

const SimpleGallery: Block = {
  slug: 'simpleGallery',
  interfaceName: 'SimpleGallery',
  labels: {
    singular: 'Simple Gallery',
    plural: 'Simple Galleries',
  },
  admin: {
    group: 'Media',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Gallery Title',
      required: false,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Gallery Description',
      required: false,
      localized: true,
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      required: true,
      fields: [PayloadImageField({ label: 'Image', name: 'image' })],
    },
    SectionID,
  ],
};

export default SimpleGallery;
