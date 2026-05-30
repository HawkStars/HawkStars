import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const InstagramBlock: Block = {
  slug: 'instagram',
  interfaceName: 'InstagramBlock',
  labels: {
    singular: { en: 'Instagram Block', pt: 'Bloco do Instagram' },
    plural: { en: 'Instagram Blocks', pt: 'Blocos do Instagram' },
  },
  admin: {
    group: 'Media',
  },
  fields: [
    {
      name: 'version',
      type: 'select',
      label: { en: 'Version', pt: 'Versão' },
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Widget', value: 'widget' },
      ],
      admin: {
        description: {
          en: 'Pick the version of the Instagram block to display.',
          pt: 'Escolha a versão do bloco do Instagram a exibir.',
        },
      },
    },
    SectionID,
  ],
};
