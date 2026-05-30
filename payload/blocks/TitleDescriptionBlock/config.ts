import SectionID from '@/payload/fields/SectionID';
import { Block } from 'payload';

const TitleDescriptionBlock: Block = {
  slug: 'titleDescriptionBlock',
  labels: {
    singular: { en: 'Title & Description Block', pt: 'Bloco de Título e Descrição' },
    plural: { en: 'Title & Description Blocks', pt: 'Blocos de Título e Descrição' },
  },
  interfaceName: 'TitleDescriptionBlock',
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: { en: 'Title', pt: 'Título' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: { en: 'Description', pt: 'Descrição' },
    },
    SectionID,
  ],
};

export default TitleDescriptionBlock;
