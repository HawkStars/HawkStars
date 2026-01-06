import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeroImpactStatsBlock } from './Component';

const meta: Meta<typeof HeroImpactStatsBlock> = {
  title: 'Hero/Community Impact',
  component: HeroImpactStatsBlock,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    blockType: {
      table: {
        disable: true,
      },
    },
    id: {
      table: {
        disable: true,
      },
    },
    blockName: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroImpactStatsBlock>;

export const Default: Story = {
  args: {
    badge: 'OUR IMPACT',
    title: 'Making a Difference in Communities Worldwide',
    description:
      "Through our dedicated efforts and community partnerships, we've been able to create lasting positive change that impacts thousands of lives.",
    heroImage: {
      id: '1',
      alt: 'Impact hero image',
      url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop&crop=center',
      filename: 'impact-hero.jpg',
      mimeType: 'image/jpeg',
      filesize: 150000,
      width: 600,
      height: 400,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    stats: [
      {
        number: '10,000+',
        label: 'Lives Changed',
        icon: 'heart',
        id: '1',
      },
      {
        number: '500+',
        label: 'Volunteers',
        icon: 'users',
        id: '2',
      },
      {
        number: '25',
        label: 'Countries Reached',
        icon: 'globe',
        id: '3',
      },
      {
        number: '98%',
        label: 'Success Rate',
        icon: 'target',
        id: '4',
      },
    ],
    ctaText: 'Join Our Mission',
    ctaLink: '/contribute',
    secondaryCtaText: 'Learn More',
    secondaryCtaLink: '/about',
    id: '1',
    blockName: 'HeroImpactStats',
    blockType: 'heroImpactStats',
  },
};

export const MinimalImpact: Story = {
  parameters: {
    title: 'Hero/HeroImpactStats/Marketing',
  },
  args: {
    title: 'Our Growing Impact',
    description: "Every day we're making progress towards our mission.",
    stats: [
      {
        number: '1,500',
        label: 'People Helped',
        icon: 'heart',
        id: '1',
      },
      {
        number: '50+',
        label: 'Active Volunteers',
        icon: 'users',
        id: '2',
      },
    ],
    ctaText: 'Get Involved',
    ctaLink: '/volunteer',
    id: '2',
    blockName: 'HeroImpactStats',
    blockType: 'heroImpactStats',
  },
};

export const FinancialTransparency: Story = {
  parameters: {
    title: 'Hero/HeroImpactStats/Financial Transparency',
  },
  args: {
    badge: 'TRANSPARENCY',
    title: 'Financial Impact Report',
    description: 'See how your donations are making a real difference in our communities.',
    stats: [
      {
        number: '€125K',
        label: 'Funds Raised',
        icon: 'trendingUp',
        id: '1',
      },
      {
        number: '€118K',
        label: 'Directly Distributed',
        icon: 'target',
        id: '2',
      },
      {
        number: '94%',
        label: 'Efficiency Rate',
        icon: 'award',
        id: '3',
      },
      {
        number: '15',
        label: 'Projects Funded',
        icon: 'globe',
        id: '4',
      },
    ],
    ctaText: 'View Full Report',
    ctaLink: '/transparency',
    id: '3',
    blockName: 'HeroImpactStats',
    blockType: 'heroImpactStats',
  },
};

export const CommunityDevelopment: Story = {
  parameters: {
    title: 'Hero/HeroImpactStats/Community Development',
  },
  args: {
    badge: 'COMMUNITY',
    title: 'Building Stronger Communities Together',
    description:
      'Our community-centered approach ensures sustainable, long-term positive change that grows from within.',
    heroImage: {
      id: '2',
      alt: 'Community gathering',
      url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&crop=center',
      filename: 'community.jpg',
      mimeType: 'image/jpeg',
      filesize: 120000,
      width: 600,
      height: 400,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    stats: [
      {
        number: '200+',
        label: 'Community Leaders Trained',
        icon: 'users',
        id: '1',
      },
      {
        number: '85%',
        label: 'Sustainability Rate',
        icon: 'trendingUp',
        id: '2',
      },
      {
        number: '12',
        label: 'Partner Organizations',
        icon: 'globe',
        id: '3',
      },
      {
        number: '5 Years',
        label: 'Average Project Lifespan',
        icon: 'award',
        id: '4',
      },
    ],
    ctaText: 'Partner With Us',
    ctaLink: '/partners',
    secondaryCtaText: 'Our Approach',
    secondaryCtaLink: '/methodology',
    id: '4',
    blockName: 'HeroImpactStats',
    blockType: 'heroImpactStats',
  },
};

export const VolunteerRecruitment: Story = {
  parameters: {
    title: 'Hero/HeroImpactStats/Volunteer Recruitment',
  },
  args: {
    badge: 'GET INVOLVED',
    title: 'Ready to Make a Difference?',
    description:
      'Join thousands of volunteers and donors who are creating positive change in communities around the world.',
    heroImage: {
      id: '3',
      alt: 'Volunteers working together',
      url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop&crop=center',
      filename: 'volunteers.jpg',
      mimeType: 'image/jpeg',
      filesize: 180000,
      width: 600,
      height: 400,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    stats: [
      {
        number: '2,400+',
        label: 'Active Supporters',
        icon: 'heart',
        id: '1',
      },
      {
        number: '48',
        label: 'Ongoing Projects',
        icon: 'target',
        id: '2',
      },
    ],
    ctaText: 'Start Your Journey',
    ctaLink: '/get-started',
    id: '5',
    blockName: 'HeroImpactStats',
    blockType: 'heroImpactStats',
  },
};
