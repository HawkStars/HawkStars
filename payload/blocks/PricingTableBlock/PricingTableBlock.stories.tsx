import type { Meta, StoryObj } from '@storybook/react';
import { PricingTableBlock } from './Component';

const meta: Meta<typeof PricingTableBlock> = {
  title: 'Extra/PricingTableBlock',
  component: PricingTableBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof PricingTableBlock>;

export const MembershipTiers: Story = {
  args: {
    title: 'Become a Member',
    subtitle: 'Support our mission and get exclusive benefits',
    tiers: [
      {
        name: 'Friend',
        price: 10,
        currency: '€',
        period: '/month',
        description: 'Perfect for individuals who want to support our cause',
        features: [
          { feature: 'Monthly newsletter' },
          { feature: 'Community updates' },
          { feature: '10% discount on events' },
        ],
        buttonText: 'Become a Friend',
        buttonLink: '#friend',
        highlighted: false,
        id: '1',
      },
      {
        name: 'Supporter',
        price: 25,
        currency: '€',
        period: '/month',
        description: 'For those who want to make a bigger impact',
        features: [
          { feature: 'All Friend benefits' },
          { feature: 'Quarterly impact reports' },
          { feature: '20% discount on events' },
          { feature: 'Invitation to annual meeting' },
        ],
        buttonText: 'Become a Supporter',
        buttonLink: '#supporter',
        highlighted: true,
        badge: 'Most Popular',
        id: '2',
      },
      {
        name: 'Champion',
        price: 50,
        currency: '€',
        period: '/month',
        description: 'For dedicated supporters of our mission',
        features: [
          { feature: 'All Supporter benefits' },
          { feature: 'Priority event registration' },
          { feature: 'Free entry to all events' },
          { feature: 'Recognition on website' },
          { feature: 'Advisory board invitation' },
        ],
        buttonText: 'Become a Champion',
        buttonLink: '#champion',
        highlighted: false,
        id: '3',
      },
    ],
    id: '1',
    blockName: 'PricingTableBlock',
    blockType: 'pricingTable',
  },
};

export const DonationOptions: Story = {
  args: {
    title: 'One-Time Donation',
    subtitle: 'Choose an amount that works for you',
    tiers: [
      {
        name: 'Starter',
        price: 25,
        currency: '€',
        period: 'one-time',
        features: [{ feature: 'Helps fund educational materials' }, { feature: 'Tax deductible' }],
        buttonText: 'Donate €25',
        buttonLink: '#donate-25',
        highlighted: false,
        id: '1',
      },
      {
        name: 'Builder',
        price: 100,
        currency: '€',
        period: 'one-time',
        features: [
          { feature: 'Sponsors a workshop' },
          { feature: 'Tax deductible' },
          { feature: 'Thank you email' },
        ],
        buttonText: 'Donate €100',
        buttonLink: '#donate-100',
        highlighted: true,
        badge: 'Best Value',
        id: '2',
      },
      {
        name: 'Patron',
        price: 500,
        currency: '€',
        period: 'one-time',
        features: [
          { feature: 'Major impact on our programs' },
          { feature: 'Tax deductible' },
          { feature: 'Personal thank you call' },
          { feature: 'Listed as patron on website' },
        ],
        buttonText: 'Donate €500',
        buttonLink: '#donate-500',
        highlighted: false,
        id: '3',
      },
    ],
    id: '2',
    blockName: 'PricingTableBlock',
    blockType: 'pricingTable',
  },
};

export const TwoTiers: Story = {
  args: {
    title: 'Choose Your Level of Support',
    tiers: [
      {
        name: 'Individual',
        price: 15,
        currency: '€',
        period: '/month',
        features: [{ feature: 'Monthly updates' }, { feature: 'Event discounts' }],
        buttonText: 'Join as Individual',
        buttonLink: '#individual',
        highlighted: false,
        id: '1',
      },
      {
        name: 'Organization',
        price: 100,
        currency: '€',
        period: '/month',
        features: [
          { feature: 'All Individual benefits' },
          { feature: 'Partner recognition' },
          { feature: 'Logo on website' },
          { feature: 'Annual partnership report' },
        ],
        buttonText: 'Partner with Us',
        buttonLink: '#organization',
        highlighted: true,
        id: '2',
      },
    ],
    id: '3',
    blockName: 'PricingTableBlock',
    blockType: 'pricingTable',
  },
};
