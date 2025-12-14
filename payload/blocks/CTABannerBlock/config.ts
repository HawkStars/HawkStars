import type { Block } from 'payload';

export const CTABannerBlock: Block = {
  slug: 'ctaBanner',
  interfaceName: 'CTABannerBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'primaryButtonText',
      type: 'text',
    },
    {
      name: 'primaryButtonLink',
      type: 'text',
    },
    {
      name: 'secondaryButtonText',
      type: 'text',
    },
    {
      name: 'secondaryButtonLink',
      type: 'text',
    },
    {
      name: 'variant',
      type: 'select',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Split', value: 'split' },
        { label: 'Image Background', value: 'image-bg' },
      ],
      defaultValue: 'centered',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'For image-bg variant',
      },
    },
  ],
  labels: {
    plural: 'CTA Banners',
    singular: 'CTA Banner',
  },
};
