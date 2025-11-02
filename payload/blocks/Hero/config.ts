import type { Block } from 'payload';

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';

import { linkGroup } from '../../fields/linkGroup';

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'Main heading text',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      admin: {
        description: 'Supporting text or tagline',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Background image for the hero section',
      },
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      defaultValue: 50,
      min: 0,
      max: 100,
      admin: {
        description: 'Overlay opacity percentage (0-100) to improve text readability',
      },
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'Hero Sections',
    singular: 'Hero Section',
  },
};
