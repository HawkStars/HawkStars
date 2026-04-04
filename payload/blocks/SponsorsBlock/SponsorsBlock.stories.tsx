import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SponsorsBlock } from './Component';
import { http, HttpResponse } from 'msw';

const meta: Meta<typeof SponsorsBlock> = {
  title: 'Organization/Sponsors',
  component: SponsorsBlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SponsorsBlock>;

const mockSponsors = [
  {
    id: '1',
    name: 'Acme Corp',
    logo: {
      url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
    },
    website: 'https://example.com',
    tier: 'gold' as const,
  },
  {
    id: '2',
    name: 'TechNova',
    logo: {
      url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=200&fit=crop',
    },
    website: 'https://example.com',
    tier: 'gold' as const,
  },
  {
    id: '3',
    name: 'Green Solutions',
    logo: {
      url: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=200&fit=crop',
    },
    website: 'https://example.com',
    tier: 'silver' as const,
  },
  {
    id: '4',
    name: 'EuroFund',
    logo: {
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=200&h=200&fit=crop',
    },
    website: null,
    tier: 'silver' as const,
  },
  {
    id: '5',
    name: 'BuildRight',
    logo: { url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop' },
    website: 'https://example.com',
    tier: 'bronze' as const,
  },
  {
    id: '6',
    name: 'LocalCafe',
    logo: null,
    website: null,
    tier: 'bronze' as const,
  },
];

export const AllTiers: Story = {
  args: {
    title: 'Our Sponsors',
    subtitle: 'We are grateful for the support of our sponsors',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/sponsors', () => {
          return HttpResponse.json({ docs: mockSponsors });
        }),
      ],
    },
  },
};

export const GoldOnly: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/sponsors', () => {
          return HttpResponse.json({ docs: mockSponsors.filter((s) => s.tier === 'gold') });
        }),
      ],
    },
  },
  args: {
    title: 'Gold Sponsors',
    subtitle: null,
  },
};

export const ManySponsors: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/sponsors', () => {
          return HttpResponse.json({
            docs: [
              ...mockSponsors,
              { id: '7', name: 'DataStream', logo: null, website: null, tier: 'gold' as const },
              { id: '8', name: 'Cloudify', logo: null, website: null, tier: 'silver' as const },
              { id: '9', name: 'NetBridge', logo: null, website: null, tier: 'silver' as const },
              { id: '10', name: 'PackLogic', logo: null, website: null, tier: 'bronze' as const },
              { id: '11', name: 'ClearView', logo: null, website: null, tier: 'bronze' as const },
              { id: '12', name: 'Pinnacle', logo: null, website: null, tier: 'bronze' as const },
            ],
          });
        }),
      ],
    },
  },
  args: {
    title: 'Our Sponsors',
    subtitle: 'A growing network of support',
  },
};

export const NoHeader: Story = {
  args: {
    title: null,
    subtitle: null,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/sponsors', () => {
          return HttpResponse.json({ docs: mockSponsors });
        }),
      ],
    },
  },
};
