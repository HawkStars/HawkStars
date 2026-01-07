import { PayloadImageField } from '@/payload/fields/ImageType';
import { linkGroup } from '@/payload/fields/linkGroup';
import SectionID from '@/payload/fields/SectionID';
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
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
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
    PayloadImageField({ name: 'backgroundImage', description: 'For image-bg variant' }),
    SectionID,
  ],
  labels: {
    plural: 'CTA Banners',
    singular: 'CTA Banner',
  },
};
