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
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    SectionID,
  ],
};

export default TitleDescriptionBlock;
