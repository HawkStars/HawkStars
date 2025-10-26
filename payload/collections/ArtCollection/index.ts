import { CollectionConfig, Tab } from 'payload';
import { authenticated } from '../../access/authenticated';
import { anyone } from '../../access/anyone';
import ArtCollectionDetails from './ArtCollectionDetails';

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
    singular: 'Artwork',
    plural: 'Artworks',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'artist', 'year', 'is_sold'],
  },

  fields: [
    {
      type: 'tabs',
      label: 'Artwork Details',
      tabs: [ArtCollectionDetails],
    },
  ],
};
