import { PayloadImageField } from '@/payload/fields/ImageType';
import { Block } from 'payload';

const AboutBlock: Block = {
  slug: 'aboutBlock',
  labels: {
    singular: 'About Block',
    plural: 'About Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    PayloadImageField({ label: 'Image', name: 'image' }),
  ],
};

export default AboutBlock;
