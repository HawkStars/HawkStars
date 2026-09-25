import type { CollectionConfig } from 'payload';
import CuratorFieldsTab from './CuratorFieldsTab';
import { anyone } from '@/payload/access/anyone';
import { authenticated } from '@/payload/access/authenticated';
import { CuratorSeoGroup } from './CuratorSeoTab';
import { GROUP_LABELS } from '@/payload/constants';
import { createRevalidateHooks } from '@/payload/utilities/revalidateCollection';

export const CURATOR_CACHE_TAG = 'curators' as const;
const { afterChange: revalidateCurator, afterDelete: revalidateCuratorDelete } =
  createRevalidateHooks(CURATOR_CACHE_TAG);

export const Curator: CollectionConfig = {
  slug: 'curators',
  // The list's bulk "Edit" asks editors to pick fields one by one; editing a
  // gallery item always goes through its full page (click the title instead).
  disableBulkEdit: true,
  access: {
    admin: authenticated,
    read: anyone,
    create: authenticated,
    delete: authenticated,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateCurator],
    afterDelete: [revalidateCuratorDelete],
  },
  labels: {
    singular: { en: 'Curator', pt: 'Curador' },
    plural: { en: 'Curators', pt: 'Curadores' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
    description: {
      en: 'Manage the curators who oversee the HawkStars Art Gallery. Add their profiles and SEO information for their public pages. Artworks are linked to a curator from the Artwork collection.',
      pt: 'Gira os curadores que supervisionam a Galeria de Arte HawkStars. Adicione os seus perfis e informações SEO para as suas páginas públicas. As obras de arte são associadas a um curador a partir da coleção Obras de Arte.',
    },
    group: {
      ...GROUP_LABELS.artGallery,
    },
    pagination: {
      limits: [10, 25, 50, 100],
      defaultLimit: 25,
    },
  },
  fields: [...CuratorFieldsTab.fields, CuratorSeoGroup],
};
