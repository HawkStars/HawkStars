import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const VolunteerCalloutBlock: Block = {
  slug: 'volunteerCallout',
  interfaceName: 'VolunteerCalloutBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Become a Volunteer',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'opportunities',
      type: 'array',
      fields: [
        {
          name: 'role',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'commitment',
          type: 'text',
          admin: {
            description: 'Time commitment (e.g., "5 hours/week")',
          },
        },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Apply Now',
    },
    {
      name: 'ctaLink',
      type: 'text',
    },
    SectionID,
  ],
  labels: {
    plural: 'Volunteer Callouts',
    singular: 'Volunteer Callout',
  },
};
