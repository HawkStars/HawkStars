import { geocodeButton } from '@/payload/fields/GeocodeButton';
import { Tab } from 'payload';

export const HawkProjectDiscoverEuFields: Tab = {
  name: 'discoverEuFields',
  label: { en: 'DiscoverEU', pt: 'DiscoverEU' },
  admin: {
    description: {
      en: 'Information about the project’s DiscoverEU fields, including their names, roles, and contributions.',
      pt: 'Informação sobre os campos DiscoverEU do projeto, incluindo nomes, funções e contribuições.',
    },
    condition: (_, siblingData) => siblingData?.project_type === 'discover_eu',
  },
  fields: [
    {
      name: 'DiscoverEuItineraryDates',
      type: 'array',
      label: { en: 'Itinerary Dates', pt: 'Datas do Itinerário' },
      interfaceName: 'HawkProjectDiscoverEuItineraryDates',
      admin: {
        description: {
          en: 'List of stops in the DiscoverEU itinerary, including city names, arrival and departure dates, and optional coordinates.',
          pt: 'Lista de paragens no itinerário DiscoverEU, incluindo nomes das cidades, datas de chegada e partida, e coordenadas opcionais.',
        },
        components: {
          RowLabel: '@/payload/collections/HawkProject/components/DiscoverEU/Itinerary',
        },
      },
      fields: [
        { name: 'startDate', label: { en: 'Arrival Date', pt: 'Data de Chegada' }, type: 'date' },
        { name: 'endDate', label: { en: 'Departure Date', pt: 'Data de Partida' }, type: 'date' },
      ],
    },
    {
      name: 'discoverEuStops',
      label: { en: 'DiscoverEU Stops', pt: 'Paragens DiscoverEU' },
      type: 'array',
      interfaceName: 'HawkProjectDiscoverEuStop',
      labels: {
        singular: { en: 'Stop', pt: 'Paragem' },
        plural: { en: 'Stops', pt: 'Paragens' },
      },
      admin: {
        description: {
          en: 'Cities participants travel to as part of this DiscoverEU project, in travel order. Used to draw the route map on the project page.',
          pt: 'Cidades para onde os participantes viajam neste projeto DiscoverEU, por ordem de viagem. Usado para desenhar o mapa da rota na página do projeto.',
        },
        components: {
          RowLabel: '@/payload/components/admin/DiscoverEuStopRowLabel',
        },
        initCollapsed: true,
      },
      fields: [
        {
          name: 'city',
          label: { en: 'City', pt: 'Cidade' },
          type: 'text',
          required: true,
          admin: {
            description: { en: 'e.g. "Berlin, Germany"', pt: 'ex: "Berlim, Alemanha"' },
          },
        },
        geocodeButton({ sourceField: 'city' }),
        {
          type: 'row',
          fields: [
            {
              name: 'latitude',
              label: { en: 'Latitude', pt: 'Latitude' },
              type: 'number',
              admin: { width: '25%', step: 0.000001 },
            },
            {
              name: 'longitude',
              label: { en: 'Longitude', pt: 'Longitude' },
              type: 'number',
              admin: { width: '25%', step: 0.000001 },
            },
          ],
        },
      ],
    },
  ],
};
