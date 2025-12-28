import SectionID from '@/payload/fields/SectionID';
import { Block } from 'payload';

const TitleDescriptionBlock: Block = {
  slug: 'titleDescriptionBlock',
  labels: {
    singular: 'Title & Description Block',
    plural: 'Title & Description Blocks',
  },
  interfaceName: 'TitleDescriptionBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    SectionID,
  ],
};

export default TitleDescriptionBlock;
