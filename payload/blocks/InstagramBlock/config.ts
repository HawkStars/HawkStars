import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const InstagramBlock: Block = {
  slug: 'instagram',
  interfaceName: 'InstagramBlock',
  labels: {
    singular: 'Instagram Block',
    plural: 'Instagram Blocks',
  },
  admin: {
    group: 'Media',
  },
  fields: [
    {
      name: 'version',
      type: 'select',
      label: 'Version',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Widget', value: 'widget' },
      ],
      admin: {
        description: 'Pick the version of the Instagram block to display.',
      },
    },
    SectionID,
  ],
};
