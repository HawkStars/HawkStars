import { PayloadImageField } from '@/payload/fields/ImageType';
import { linkGroup } from '@/payload/fields/linkGroup';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const HeroWithBackgroundImage: Block = {
  slug: 'heroWithBackgroundImage',
  interfaceName: 'HeroWithBackgroundImageBlock',
  fields: [
    PayloadImageField({
      name: 'backgroundImage',
      label: 'Background Image',
      required: true,
      description: 'Background image for the hero section',
    }),
    {
      name: 'title',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'Main heading text',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Subtitle or description text',
      },
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 50,
      admin: {
        description: 'Overlay darkness (0-100%)',
      },
    },
    linkGroup({ overrides: { maxRows: 2 } }),
    {
      name: 'textAlignment',
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'center',
      admin: {
        description: 'Text alignment',
      },
    },
    SectionID,
  ],
  labels: {
    plural: 'Hero with Background Image Sections',
    singular: 'Hero with Background Image Section',
  },
};
