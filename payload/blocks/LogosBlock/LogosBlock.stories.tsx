import type { Meta, StoryObj } from '@storybook/react';
import { LogosBlock } from './Component';

const meta: Meta<typeof LogosBlock> = {
  title: 'Payload Blocks/LogosBlock',
  component: LogosBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof LogosBlock>;

export const Default: Story = {
  args: {
    badgeText: 'Referral Partners',
    heading: 'Trusted by Industry Leaders',
    description: 'Join thousands of companies that rely on our platform to grow their business.',
    buttonText: 'Become a partner',
    logos: [
      {
        name: 'Acme Corp',
        logo: 'https://via.placeholder.com/150x50/4A90E2/FFFFFF?text=Acme+Corp',
        id: '1',
      },
      {
        name: 'Tech Solutions',
        logo: 'https://via.placeholder.com/150x50/50E3C2/FFFFFF?text=Tech+Solutions',
        id: '2',
      },
      {
        name: 'Digital Agency',
        logo: 'https://via.placeholder.com/150x50/F5A623/FFFFFF?text=Digital+Agency',
        id: '3',
      },
      {
        name: 'Innovation Labs',
        logo: 'https://via.placeholder.com/150x50/BD10E0/FFFFFF?text=Innovation+Labs',
        id: '4',
      },
      {
        name: 'Cloud Services',
        logo: 'https://via.placeholder.com/150x50/7ED321/FFFFFF?text=Cloud+Services',
        id: '5',
      },
      {
        name: 'Global Ventures',
        logo: 'https://via.placeholder.com/150x50/D0021B/FFFFFF?text=Global+Ventures',
        id: '6',
      },
    ],
    id: '1',
    blockName: 'LogosBlock',
    blockType: 'logosBlock',
  },
};

export const NoBadge: Story = {
  args: {
    heading: 'Our Partners',
    description: 'Working with the best in the industry.',
    logos: [
      {
        name: 'Partner 1',
        logo: 'https://via.placeholder.com/150x50/4A90E2/FFFFFF?text=Partner+1',
        id: '1',
      },
      {
        name: 'Partner 2',
        logo: 'https://via.placeholder.com/150x50/50E3C2/FFFFFF?text=Partner+2',
        id: '2',
      },
      {
        name: 'Partner 3',
        logo: 'https://via.placeholder.com/150x50/F5A623/FFFFFF?text=Partner+3',
        id: '3',
      },
      {
        name: 'Partner 4',
        logo: 'https://via.placeholder.com/150x50/BD10E0/FFFFFF?text=Partner+4',
        id: '4',
      },
    ],
    id: '2',
    blockName: 'LogosBlock',
    blockType: 'logosBlock',
  },
};

export const WithButton: Story = {
  args: {
    heading: 'Trusted Worldwide',
    description: 'Join our network of partners and grow together.',
    buttonText: 'Partner with us',
    logos: [
      {
        name: 'Company A',
        logo: 'https://via.placeholder.com/150x50/4A90E2/FFFFFF?text=Company+A',
        id: '1',
      },
      {
        name: 'Company B',
        logo: 'https://via.placeholder.com/150x50/50E3C2/FFFFFF?text=Company+B',
        id: '2',
      },
      {
        name: 'Company C',
        logo: 'https://via.placeholder.com/150x50/F5A623/FFFFFF?text=Company+C',
        id: '3',
      },
    ],
    id: '3',
    blockName: 'LogosBlock',
    blockType: 'logosBlock',
  },
};

export const MinimalLogos: Story = {
  args: {
    heading: 'Featured In',
    logos: [
      {
        name: 'Media 1',
        logo: 'https://via.placeholder.com/150x50/4A90E2/FFFFFF?text=Media+1',
        id: '1',
      },
      {
        name: 'Media 2',
        logo: 'https://via.placeholder.com/150x50/50E3C2/FFFFFF?text=Media+2',
        id: '2',
      },
    ],
    id: '4',
    blockName: 'LogosBlock',
    blockType: 'logosBlock',
  },
};
