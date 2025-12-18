import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const HeroWithBackgroundImage: Block = {
  slug: 'heroWithBackgroundImage',
  interfaceName: 'HeroWithBackgroundImageBlock',
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Background image for the hero section',
      },
    },
    {
      name: 'title',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Main heading text',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
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
    {
      name: 'primaryCtaText',
      type: 'text',
      admin: {
        description: 'Primary call-to-action button text',
      },
    },
    {
      name: 'primaryCtaLink',
      type: 'text',
      admin: {
        description: 'URL for the primary CTA button',
      },
    },
    {
      name: 'secondaryCtaText',
      type: 'text',
      admin: {
        description: 'Secondary call-to-action button text',
      },
    },
    {
      name: 'secondaryCtaLink',
      type: 'text',
      admin: {
        description: 'URL for the secondary CTA button',
      },
    },
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
