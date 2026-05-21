import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const StepsConfigBlock: Block = {
  slug: 'stepsBlock',
  interfaceName: 'StepsBlock',
  admin: {
    group: 'Content Cards',
  },
  fields: [
    {
      type: 'select',
      name: 'numberOfColumnsPerRow',
      required: true,
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
      ],
      admin: {
        description: 'Select the number of columns per row for the steps layout.',
      },
    },
    {
      type: 'array',
      name: 'steps',
      interfaceName: 'StepsBlockItem',
      minRows: 1,
      required: true,
      fields: [
        {
          type: 'text',
          name: 'title',
          localized: true,
          required: true,
          admin: { description: 'Title of the step' },
        },
        {
          type: 'text',
          name: 'description',
          localized: true,
          required: true,
          admin: { description: 'Description of the step' },
        },
      ],
    },
    SectionID,
  ],
  labels: {
    plural: 'Steps Blocks',
    singular: 'Step Block',
  },
};
