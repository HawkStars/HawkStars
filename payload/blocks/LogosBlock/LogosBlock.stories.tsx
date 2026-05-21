import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LogosBlock } from './Component';

const meta: Meta<typeof LogosBlock> = {
  title: 'Media/Logos',
  component: LogosBlock,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    heading: { control: 'text' },
    description: { control: 'text' },
    badgeText: { control: 'text' },
    buttonText: { control: 'text' },
    blockType: { table: { disable: true } },
    id: { table: { disable: true } },
    blockName: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof LogosBlock>;

const sampleLogos = [
  { name: 'Creative Labs', logo: 'https://cdn.worldvectorlogo.com/logos/creative-labs-1.svg', id: '1' },
  { name: 'Dallas Semiconductor', logo: 'https://cdn.worldvectorlogo.com/logos/dallas-semiconductor.svg', id: '2' },
  { name: 'Nexpress', logo: 'https://cdn.worldvectorlogo.com/logos/nexpress.svg', id: '3' },
  { name: 'Lenovo', logo: 'https://cdn.worldvectorlogo.com/logos/lenovo-2.svg', id: '4' },
  { name: 'Motorola', logo: 'https://cdn.worldvectorlogo.com/logos/motorola-2.svg', id: '5' },
  { name: 'Starbucks', logo: 'https://cdn.worldvectorlogo.com/logos/starbucks-coffee.svg', id: '6' },
];

export const Default: Story = {
  args: {
    badgeText: 'Referral Partners',
    heading: 'Trusted by Industry Leaders',
    description: 'Join thousands of companies that rely on our platform to grow their business.',
    buttonText: 'Become a partner',
    logos: sampleLogos,
    id: '1',
    blockName: 'LogosBlock',
    blockType: 'logosBlock',
  },
};

export const NoBadge: Story = {
  args: {
    heading: 'Our Partners',
    description: 'Working with the best in the industry.',
    logos: sampleLogos.slice(0, 4),
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
    logos: sampleLogos.slice(0, 3),
    id: '3',
    blockName: 'LogosBlock',
    blockType: 'logosBlock',
  },
};

export const MinimalLogos: Story = {
  args: {
    heading: 'Featured In',
    logos: sampleLogos.slice(0, 2),
    id: '4',
    blockName: 'LogosBlock',
    blockType: 'logosBlock',
  },
};
