import { CollectionConfig, Tab } from 'payload';
import { SEOTab } from '../fields/objects/SeoFields';
import { authenticated } from '../access/authenticated';
import { anyone } from '../access/anyone';

const ArtCollectionDetails: Tab = {
  label: 'Details',
  description: 'Information about the artwork',
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      hooks: {
        beforeChange: [
          ({ data }) => {
            data?.title?.replace(/\s+/g, '-').toLowerCase();
          },
        ],
      },
    },
    {
      name: 'artist',
      label: 'Artist',
      type: 'relationship',
      required: true,
      relationTo: 'curators',
      hasMany: false,
      admin: {
        allowCreate: false,
        allowEdit: false,
      },
    },
    {
      name: 'synopsis',
      label: 'Synopsis',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      localized: false,
    },
    {
      name: 'is_sold',
      label: 'Vendido?',
      type: 'checkbox',
      localized: false,
    },
    {
      name: 'year',
      label: 'Year',
      type: 'number',
      localized: false,
    },
    {
      name: 'price',
      label: 'Price',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'settings',
      label: 'Photo Settings',
      type: 'text',
      localized: true,
      required: false,
    },
    {
      name: 'tiragem',
      label: 'Tiragem',
      type: 'text',
      localized: true,
      required: false,
    },
    {
      name: 'dimensions',
      label: 'Dimensions',
      type: 'text',
      localized: true,
      required: false,
    },
    {
      name: 'extra',
      label: 'Extra Information',
      type: 'richText',
      required: false,
      localized: true,
    },
  ],
};

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
      tabs: [ArtCollectionDetails, SEOTab],
    },
  ],
};
