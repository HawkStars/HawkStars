import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const DonationWidgetBlock: Block = {
  slug: 'donationWidget',
  interfaceName: 'DonationWidgetBlock',
  labels: {
    singular: 'Donation Widget',
    plural: 'Donation Widgets',
  },
  fields: [SectionID],
};
