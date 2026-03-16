import { CollectionConfig } from 'payload';
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
    description:
      'Manage the art collection catalogue. Add new artworks with details like artist, year, medium, and sale status. These appear in the public gallery on the website.',
    group: {
      name: 'Art Gallery',
    },
  },

  fields: [
    {
      type: 'tabs',
      label: 'Artwork Details',
      tabs: [ArtCollectionDetails],
    },
  ],
};
