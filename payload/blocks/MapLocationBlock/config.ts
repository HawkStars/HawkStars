import SectionID from '@/payload/fields/SectionID';
import { geocodeButton } from '@/payload/fields/GeocodeButton';
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
      label: { en: 'Title', pt: 'Título' },
    },
    {
      name: 'address',
      type: 'textarea',
      required: true,
      localized: true,
      label: { en: 'Address', pt: 'Morada' },
    },
    geocodeButton({ sourceField: 'address' }),
    {
      name: 'latitude',
      type: 'number',
      required: true,
      label: { en: 'Latitude', pt: 'Latitude' },
    },
    {
      name: 'longitude',
      type: 'number',
      required: true,
      label: { en: 'Longitude', pt: 'Longitude' },
    },
    {
      name: 'phone',
      type: 'text',
      localized: true,
      label: { en: 'Phone', pt: 'Telefone' },
    },
    {
      name: 'email',
      type: 'email',
      localized: true,
      label: { en: 'Email', pt: 'Email' },
    },
    {
      name: 'hours',
      type: 'textarea',
      localized: true,
      label: { en: 'Hours', pt: 'Horário' },
      admin: {
        description: { en: 'Operating hours', pt: 'Horário de funcionamento' },
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Map Locations', pt: 'Localizações no Mapa' },
    singular: { en: 'Map Location', pt: 'Localização no Mapa' },
  },
};
