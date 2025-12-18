import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const GlobalVillageBannerBlock: Block = {
  slug: 'globalVillageBanner',
  interfaceName: 'GlobalVillageBannerBlock',
  labels: {
    singular: 'Global Village Banner',
    plural: 'Global Village Banners',
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      label: 'Banner Text',
      required: true,
      localized: true,
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      defaultValue: 'green',
      options: [
        { label: 'Green', value: 'green' },
        { label: 'Bege Dark', value: 'bege-dark' },
        { label: 'Bege Light', value: 'bege-light' },
      ],
    },
    SectionID,
  ],
};
