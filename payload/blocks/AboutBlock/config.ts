import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
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
    SectionID,
    PayloadImageField({ label: 'Image', name: 'image' }),
  ],
};

export default AboutBlock;
