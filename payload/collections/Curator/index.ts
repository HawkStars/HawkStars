import type { CollectionConfig } from 'payload';
import CuratorFieldsTab from './CuratorFieldsTab';
import { anyone } from '@/payload/access/anyone';
import { authenticated } from '@/payload/access/authenticated';
import { CuratorTab } from './CuratorSeoTab';

export const Curator: CollectionConfig = {
  slug: 'curators',
  access: {
    admin: authenticated,
    read: anyone,
    create: authenticated,
    delete: authenticated,
    update: authenticated,
  },
  labels: {
    singular: 'Curator',
    plural: 'Curators',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'updatedAt'],
    description:
      'Manage art curators who oversee and contribute to the HawkStars collection. Add their profiles, roles, and SEO information for their public pages.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [CuratorFieldsTab, CuratorTab],
    },
  ],
};
