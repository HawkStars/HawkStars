import type { Meta, StoryObj } from '@storybook/react';
import { MapLocationBlock } from './Component';

const meta: Meta<typeof MapLocationBlock> = {
  title: 'Maps/MapLocationBlock',
  component: MapLocationBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof MapLocationBlock>;

export const Default: Story = {
  args: {
    title: 'Visit Us',
    address: 'Rua Example, 123\n1000-000 Lisboa\nPortugal',
    latitude: 38.7223,
    longitude: -9.1393,
    phone: '+351 21 123 4567',
    email: 'info@example.org',
    hours: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 2:00 PM\nSunday: Closed',
    id: '1',
    blockName: 'MapLocationBlock',
    blockType: 'mapLocation',
  },
};
