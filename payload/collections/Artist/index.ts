import type { CollectionConfig } from 'payload';
import ArtistFieldsTab from './ArtistFieldsTab';
import { anyone } from '@/payload/access/anyone';
import { authenticated } from '@/payload/access/authenticated';
import { ArtistSeoGroup } from './ArtistSeoTab';
import { GROUP_LABELS } from '@/payload/constants';
import { createRevalidateHooks } from '@/payload/utilities/revalidateCollection';

export const ARTIST_CACHE_TAG = 'artists' as const;
const { afterChange: revalidateArtist, afterDelete: revalidateArtistDelete } =
  createRevalidateHooks(ARTIST_CACHE_TAG);

export const Artist: CollectionConfig = {
  slug: 'artists',
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
    afterChange: [revalidateArtist],
    afterDelete: [revalidateArtistDelete],
  },
  labels: {
    singular: { en: 'Artist', pt: 'Artista' },
    plural: { en: 'Artists', pt: 'Artistas' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
    description: {
      en: 'Manage the artists whose work appears in the HawkStars Art Gallery. Add their profiles and SEO information for their public pages.',
      pt: 'Gira os artistas cujas obras aparecem na Galeria de Arte HawkStars. Adicione os seus perfis e informações SEO para as suas páginas públicas.',
    },
    group: {
      ...GROUP_LABELS.artGallery,
    },
    pagination: {
      limits: [10, 25, 50, 100],
      defaultLimit: 25,
    },
  },
  fields: [...ArtistFieldsTab.fields, ArtistSeoGroup],
};
