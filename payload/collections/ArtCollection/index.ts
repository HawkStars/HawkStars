import { CollectionConfig } from 'payload';
import { authenticated } from '../../access/authenticated';
import { authenticatedAdmin } from '../../access/authenticatedAdmin';
import { anyone } from '../../access/anyone';
import ArtCollectionFields from './ArtCollectionDetails';
import { syncEditions } from './hooks/syncEditions';
import { GROUP_LABELS } from '@/payload/constants';
import { notifyArtworkChange, notifyArtworkDelete } from './hooks';
import { createRevalidateHooks } from '@/payload/utilities/revalidateCollection';

export const ART_COLLECTION_CACHE_TAG = 'artworks' as const;
const { afterChange: revalidateArtwork, afterDelete: revalidateArtworkDelete } =
  createRevalidateHooks(ART_COLLECTION_CACHE_TAG);

export const ArtCollection: CollectionConfig = {
  slug: 'artworks',
  // The list's bulk "Edit" asks editors to pick fields one by one; editing a
  // gallery item always goes through its full page (click the title instead).
  disableBulkEdit: true,
  access: {
    admin: authenticated,
    read: anyone,
    create: authenticated,
    delete: authenticatedAdmin,
    update: authenticated,
  },
  labels: {
    singular: { en: 'Artwork', pt: 'Obra de Arte' },
    plural: { en: 'Artworks', pt: 'Obras de Arte' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'artist', 'category', 'price_value', 'available_quantity', 'is_sold'],
    description: {
      en: 'Manage the art collection catalogue. Add new artworks with details like artist, year, medium, and sale status. These appear in the public gallery on the website.',
      pt: 'Gira o catálogo da coleção de arte. Adicione novas obras com detalhes como artista, ano, técnica e estado de venda. Estas aparecem na galeria pública do website.',
    },
    group: {
      ...GROUP_LABELS.artGallery,
    },
    pagination: {
      limits: [10, 25, 50, 100],
      defaultLimit: 25,
    },
  },
  fields: ArtCollectionFields,
  hooks: {
    beforeChange: [syncEditions],
    afterChange: [notifyArtworkChange, revalidateArtwork],
    afterDelete: [notifyArtworkDelete, revalidateArtworkDelete],
  },
};
