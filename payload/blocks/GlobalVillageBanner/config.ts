import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const GlobalVillageBannerBlock: Block = {
  slug: 'globalVillageBanner',
  interfaceName: 'GlobalVillageBannerBlock',
  labels: {
    singular: { en: 'Global Village Banner', pt: 'Banner da Aldeia Global' },
    plural: { en: 'Global Village Banners', pt: 'Banners da Aldeia Global' },
  },
  admin: {
    group: 'Global Village',
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      label: { en: 'Banner Text', pt: 'Texto do Banner' },
      required: true,
      localized: true,
    },
    SectionID,
  ],
};
