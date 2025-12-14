import type { Meta, StoryObj } from '@storybook/react';
import { DonorWallBlock } from './Component';

const meta: Meta<typeof DonorWallBlock> = {
  title: 'Payload Blocks/DonorWallBlock',
  component: DonorWallBlock,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['grid', 'wall', 'cards'],
    },
    sortBy: {
      control: 'select',
      options: ['amount-desc', 'level', 'name', 'manual'],
    },
    showAmounts: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DonorWallBlock>;

const sampleDonors = [
  {
    name: 'Maria Silva',
    amount: 5000,
    currency: '€',
    level: 'platinum' as const,
    message: 'Proud to support such an amazing cause!',
    id: '1',
  },
  {
    name: 'João Santos',
    amount: 2500,
    currency: '€',
    level: 'gold' as const,
    id: '2',
  },
  {
    name: 'Ana Costa',
    amount: 1000,
    currency: '€',
    level: 'silver' as const,
    message: 'Keep up the great work!',
    id: '3',
  },
  {
    name: 'Pedro Oliveira',
    amount: 500,
    currency: '€',
    level: 'bronze' as const,
    id: '4',
  },
  {
    name: 'Tech Company Ltd',
    amount: 3000,
    currency: '€',
    level: 'gold' as const,
    message: 'Investing in the future of our community',
    id: '5',
  },
  {
    name: 'Local Business Co',
    amount: 750,
    currency: '€',
    level: 'silver' as const,
    id: '6',
  },
  {
    name: 'Community Association',
    amount: 1500,
    currency: '€',
    level: 'silver' as const,
    id: '7',
  },
  {
    name: 'Carlos Ferreira',
    amount: 250,
    currency: '€',
    level: 'supporter' as const,
    id: '8',
  },
];

export const GridLayout: Story = {
  args: {
    title: 'Thank You to Our Donors',
    subtitle: 'We are grateful for the generous support of these individuals and organizations',
    donors: sampleDonors,
    layout: 'grid',
    showAmounts: false,
    sortBy: 'level',
    id: '1',
    blockName: 'DonorWallBlock',
    blockType: 'donorWall',
  },
};

export const WallLayout: Story = {
  args: {
    ...GridLayout.args,
    layout: 'wall',
  },
};

export const CardsLayout: Story = {
  args: {
    ...GridLayout.args,
    layout: 'cards',
  },
};

export const WithAmounts: Story = {
  args: {
    ...GridLayout.args,
    showAmounts: true,
  },
};

export const SortedByAmount: Story = {
  args: {
    ...GridLayout.args,
    sortBy: 'amount-desc',
    showAmounts: true,
  },
};

export const CardsWithMessages: Story = {
  args: {
    ...GridLayout.args,
    layout: 'cards',
    showAmounts: true,
  },
};
