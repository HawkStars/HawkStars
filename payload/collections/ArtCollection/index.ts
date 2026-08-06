import { CollectionConfig } from 'payload';
import { authenticated } from '../../access/authenticated';
import { anyone } from '../../access/anyone';
import ArtCollectionDetails from './ArtCollectionDetails';
import { GROUP_LABELS } from '@/payload/constants';
import { notifyArtworkChange, notifyArtworkDelete } from './hooks';
import { createRevalidateHooks } from '@/payload/utilities/revalidateCollection';

export const ART_COLLECTION_CACHE_TAG = 'artworks' as const;
const { afterChange: revalidateArtwork, afterDelete: revalidateArtworkDelete } =
  createRevalidateHooks(ART_COLLECTION_CACHE_TAG);

export const ArtCollection: CollectionConfig = {
  slug: 'artworks',
  access: {
    admin: authenticated,
    read: anyone,
    create: authenticated,
    delete: authenticated,
    update: authenticated,
  },
  labels: {
    singular: { en: 'Artwork', pt: 'Obra de Arte' },
    plural: { en: 'Artworks', pt: 'Obras de Arte' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'artist', 'year', 'is_sold'],
    description: {
      en: 'Manage the art collection catalogue. Add new artworks with details like artist, year, medium, and sale status. These appear in the public gallery on the website.',
      pt: 'Gira o catálogo da coleção de arte. Adicione novas obras com detalhes como artista, ano, técnica e estado de venda. Estas aparecem na galeria pública do website.',
    },
    group: {
      ...GROUP_LABELS.artGallery,
    },
  },
  fields: [
    {
      type: 'tabs',
      label: 'Artwork Details',
      tabs: [ArtCollectionDetails],
    },
  ],
  hooks: {
    afterChange: [notifyArtworkChange, revalidateArtwork],
    afterDelete: [notifyArtworkDelete, revalidateArtworkDelete],
  },
};
