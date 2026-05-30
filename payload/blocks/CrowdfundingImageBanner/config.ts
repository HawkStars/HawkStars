import type { Block } from 'payload';
import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import { link } from '@/payload/fields/link';

export const CrowdfundingImageBannerBlock: Block = {
  slug: 'crowdfundingImageBanner',
  interfaceName: 'CrowdfundingImageBannerBlock',
  labels: {
    singular: { en: 'Crowdfunding Image Banner', pt: 'Banner de Imagem de Crowdfunding' },
    plural: { en: 'Crowdfunding Image Banners', pt: 'Banners de Imagem de Crowdfunding' },
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
    link({
      localizedLabel: true,
      name: 'url',
      labelInformation: 'Link URL',
      description: 'URL to navigate to when the banner is clicked.',
    }),
    SectionID,
  ],
};
