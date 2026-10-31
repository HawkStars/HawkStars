import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/layout/PageHero';

const meta = {
  title: 'Layout/Structure/PageHero',
  component: PageHero,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['bege', 'green'] },
    align: { control: 'select', options: ['left', 'center'] },
    size: { control: 'select', options: ['default', 'compact'] },
    as: { control: 'select', options: ['h1', 'h2'] },
  },
  args: {
    title: 'Our team',
    description:
      'The people who keep Hawk Stars running — volunteers, board members and partners across Europe.',
  },
} satisfies Meta<typeof PageHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Green: Story = {
  args: {
    variant: 'green',
    align: 'center',
    eyebrow: 'Get involved',
    title: 'Become part of Hawk Stars',
    actions: (
      <>
        <Button variant='inverse' size='xl'>
          Explore paths
        </Button>
        <Button variant='outline-inverse' size='xl'>
          Contact us
        </Button>
      </>
    ),
  },
};

export const Compact: Story = {
  args: {
    size: 'compact',
    title: 'Terms and conditions',
    description: 'www.hawkstars.org',
  },
};
