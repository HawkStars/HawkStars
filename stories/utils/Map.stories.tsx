import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Map,
  MapLayerGroup,
  MapLayers,
  MapLayersControl,
  MapLocateControl,
  MapMarker,
  MapPopup,
  MapTileLayer,
  MapTooltip,
  MapZoomControl,
} from '@/components/ui/map';

// Pinhel, Portugal — home of Associação HawkStars
const PINHEL: [number, number] = [40.7727, -7.0608];

const meta = {
  title: 'Design System/Map',
  component: Map,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='h-[500px] w-full p-4'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Map>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    center: PINHEL,
    zoom: 14,
  },
  render: (args) => (
    <Map {...args}>
      <MapTileLayer />
    </Map>
  ),
};

export const WithMarkerAndPopup: Story = {
  args: {
    center: PINHEL,
    zoom: 14,
  },
  render: (args) => (
    <Map {...args}>
      <MapTileLayer />
      <MapMarker position={PINHEL}>
        <MapPopup>Associação HawkStars — Pinhel</MapPopup>
        <MapTooltip>HawkStars HQ</MapTooltip>
      </MapMarker>
    </Map>
  ),
};

export const WithControls: Story = {
  args: {
    center: PINHEL,
    zoom: 14,
  },
  render: (args) => (
    <Map {...args}>
      <MapTileLayer />
      <MapZoomControl />
      <MapLocateControl />
      <MapMarker position={PINHEL} />
    </Map>
  ),
};

export const WithLayers: Story = {
  args: {
    center: PINHEL,
    zoom: 13,
  },
  render: (args) => (
    <Map {...args}>
      <MapLayers defaultTileLayer='Light' defaultLayerGroups={['Points of interest']}>
        <MapTileLayer name='Light' />
        <MapTileLayer
          name='Satellite'
          url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          attribution='&copy; Esri'
        />
        <MapLayerGroup name='Points of interest'>
          <MapMarker position={PINHEL}>
            <MapTooltip>HawkStars HQ</MapTooltip>
          </MapMarker>
        </MapLayerGroup>
        <MapLayersControl />
        <MapZoomControl />
      </MapLayers>
    </Map>
  ),
};
