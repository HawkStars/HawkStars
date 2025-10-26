import type { CollectionConfig, Tab } from 'payload';
import { SEOTab } from '../../fields/objects/SeoFields';
import CuratorFieldsTab from './CuratorFieldsTab';

export const Curator: CollectionConfig = {
  slug: 'curators',
  labels: {
    singular: 'Curator',
    plural: 'Curators',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [CuratorFieldsTab, SEOTab],
    },
  ],
};
