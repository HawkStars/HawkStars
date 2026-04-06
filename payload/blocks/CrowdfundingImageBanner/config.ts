import type { Block } from 'payload';
import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';

export const CrowdfundingImageBannerBlock: Block = {
  slug: 'crowdfundingImageBanner',
  interfaceName: 'CrowdfundingImageBannerBlock',
  labels: {
    singular: 'Crowdfunding Image Banner',
    plural: 'Crowdfunding Image Banners',
  },
  admin: {
    group: 'Global Village',
  },
  fields: [
    PayloadImageField({
      name: 'image',
      label: 'Banner Image',
      required: true,
      description: 'Full-width banner image displayed across pages.',
    }),
    {
      name: 'url',
      type: 'text',
      label: 'Link URL',
      required: true,
      admin: {
        description: 'URL to navigate to when the banner is clicked.',
      },
    },
    SectionID,
  ],
};
