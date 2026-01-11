import { PayloadImageField } from '@/payload/fields/ImageType';
import { linkGroup } from '@/payload/fields/linkGroup';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const HeroSlideshowBlock: Block = {
  slug: 'heroSlideshowBlock',
  interfaceName: 'HeroSlideshowBlock',
  fields: [
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      required: true,
      labels: {
        singular: 'Slide',
        plural: 'Slides',
      },
      fields: [
        PayloadImageField({ name: 'backgroundImage', label: 'Background Image' }),
        {
          name: 'title',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Main heading text for this slide',
          },
        },
        {
          name: 'subtitle',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Subtitle or description text for this slide',
          },
        },
        linkGroup({ overrides: { maxRows: 2 } }),
        {
          name: 'textAlignment',
          type: 'select',
          required: true,
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
          defaultValue: 'center',
          admin: {
            description: 'Text alignment for all slides',
          },
        },
      ],
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 40,
      admin: {
        description: 'Overlay darkness for all slides (0-100%)',
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Automatically cycle through slides',
      },
    },
    {
      name: 'autoplayInterval',
      type: 'number',
      min: 2000,
      max: 15000,
      defaultValue: 5000,
      admin: {
        description: 'Time between slides in milliseconds (only if autoplay is enabled)',
        condition: (_, siblingData) => siblingData?.autoplay === true,
      },
    },
    {
      name: 'showNavigation',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show previous/next arrows',
      },
    },
    {
      name: 'showDots',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show navigation dots',
      },
    },
    {
      name: 'height',
      type: 'select',
      options: [
        { label: 'Full Screen', value: 'fullscreen' },
        { label: 'Large (700px)', value: 'large' },
        { label: 'Medium (500px)', value: 'medium' },
        { label: 'Small (400px)', value: 'small' },
      ],
      defaultValue: 'large',
      admin: {
        description: 'Height of the hero section',
      },
    },
    SectionID,
  ],
  labels: {
    plural: 'Hero Slideshow Blocks',
    singular: 'Hero Slideshow Block',
  },
};
