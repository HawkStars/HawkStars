import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const MapLocationBlock: Block = {
  slug: 'mapLocation',
  interfaceName: 'MapLocationBlock',
  admin: {
    group: 'Map & Events',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'address',
      type: 'textarea',
      required: true,
      localized: true,
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
      localized: true,
    },
    {
      name: 'email',
      type: 'email',
      localized: true,
    },
    {
      name: 'hours',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Operating hours',
      },
    },
    SectionID,
  ],
  labels: {
    plural: 'Map Locations',
    singular: 'Map Location',
  },
};
