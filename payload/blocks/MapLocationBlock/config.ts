import type { Block } from 'payload';

export const MapLocationBlock: Block = {
  slug: 'mapLocation',
  interfaceName: 'MapLocationBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'address',
      type: 'textarea',
      required: true,
    },
    {
      name: 'latitude',
      type: 'number',
      required: true,
    },
    {
      name: 'longitude',
      type: 'number',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'hours',
      type: 'textarea',
      admin: {
        description: 'Operating hours',
      },
    },
  ],
  labels: {
    plural: 'Map Locations',
    singular: 'Map Location',
  },
};
