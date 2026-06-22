import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Partner } from '@/payload-types';
import { sampleRichTextWithDescription } from '@/utils/storybook';
import PartnerCard from './PartnerCard';

const basePartner = {
  id: '1',
  name: 'Associação Cultural de Lisboa',
  country: 'Portugal',
  type: 'national',
  logo: {
    id: 'logo-1',
    url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=256&h=256&fit=crop',
    alt: 'Logo',
  },
  description: sampleRichTextWithDescription as unknown as Partner['description'],
  links: [
    { platform: 'website', url: 'https://example.com', isVisible: true, id: 'l1' },
    { platform: 'instagram', url: 'https://instagram.com', isVisible: true, id: 'l2' },
  ],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
} as unknown as Partner;

const meta = {
  title: 'Partners/PartnerCard',
  component: PartnerCard,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  render: (args) => (
    <div className='w-72'>
      <PartnerCard {...args} />
    </div>
  ),
} satisfies Meta<typeof PartnerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: basePartner,
};

export const International: Story = {
  args: {
    ...basePartner,
    name: 'European Youth Foundation',
    country: 'Germany',
    type: 'international',
    logo: {
      id: 'logo-2',
      url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=256&h=256&fit=crop',
      alt: 'Logo',
    },
  } as unknown as Partner,
};

export const NoDescriptionNoLinks: Story = {
  args: {
    ...basePartner,
    name: 'Câmara Municipal de Pinhel',
    description: null,
    links: [],
  } as unknown as Partner,
};
