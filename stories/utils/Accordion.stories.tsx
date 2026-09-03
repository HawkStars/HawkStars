import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Accordion from '@/components/utils/Accordion/Accordion';

// This is the standalone single-panel accordion used in feature sections
// (e.g. the contribute page's ChairsSection) -- distinct from the Radix
// multi-item `components/ui/accordion` used by the CMS-driven AccordionBlock.
const meta = {
  title: 'Design System/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  render: (args) => (
    <div className='w-96'>
      <Accordion {...args} />
    </div>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Who can become a contributor?',
    children:
      'Anyone who supports our mission can become a monthly contributor, regardless of the amount.',
  },
};

export const DefaultOpen: Story = {
  args: {
    ...Default.args,
    defaultOpen: true,
  },
};

export const LongTitle: Story = {
  args: {
    title:
      'What happens to my contribution if the campaign does not reach its funding goal by the deadline?',
    children: 'All contributions are used to support ongoing HawkStars programmes regardless.',
  },
};
