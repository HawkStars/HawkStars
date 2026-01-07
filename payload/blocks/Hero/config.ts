import { PayloadImageField } from '@/payload/fields/ImageType';
import { link } from '@/payload/fields/link';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'badge',
      type: 'text',
      admin: {
        description: 'Badge label above heading (e.g., "PLATFORM")',
      },
    },
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Main heading text',
      },
    },
    link({ name: 'ctaLink', description: 'Call-to-action button information' }),
    PayloadImageField({
      name: 'headerImage',
      label: 'Header Image',
      required: false,
      description: 'Image displayed above the heading',
    }),
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Globe', value: 'globe' },
            { label: 'Rocket', value: 'rocket' },
            { label: 'Expand', value: 'expand' },
            { label: 'Wrench', value: 'wrench' },
          ],
          required: true,
          admin: {
            description: 'Icon type for this feature',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Feature title',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Feature description',
          },
        },
      ],
      maxRows: 4,
      admin: {
        description: 'Feature cards displayed in grid (up to 4)',
      },
    },
    SectionID,
  ],
  labels: {
    plural: 'Hero Sections',
    singular: 'Hero Section',
  },
};
