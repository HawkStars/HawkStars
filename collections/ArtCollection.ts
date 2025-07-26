import { CollectionConfig } from 'payload';
import { SEOFields } from './objects/SeoFields';

export const ArtCollection: CollectionConfig = {
  slug: 'artworks',
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
      tabs: [
        {
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
            // {
            //   name: 'artist',
            //   label: 'Artist',
            //   type: 'relationship',
            //   required: true,
            //   relationTo: '',
            //   hasMany: false,
            //   admin: {
            //     allowCreate: false,
            //     allowEdit: false,
            //   },
            // },
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
              localized: true,
              required: true,
            },
            {
              name: 'is_sold',
              label: 'Vendido?',
              type: 'checkbox',
            },
            {
              name: 'year',
              label: 'Year',
              type: 'number',
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
        },
        {
          label: 'SEO',
          description: 'Search Engine Optimization fields',
          fields: [SEOFields],
        },
      ],
    },
  ],
};
