import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SectionTitle from '@/components/ui/SectionTitle';

const meta = {
  title: 'UI/SectionTitle',
  component: SectionTitle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='w-[480px]'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Our Mission',
    sectionId: 'mission',
  },
};

export const WithSubtitle: Story = {
  args: {
    title: 'Our Mission',
    sectionId: 'mission',
    subtitle: 'Supporting culture and humanitarian causes in Pinhel.',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Associação HawkStars — Cultural and Humanitarian Work',
    sectionId: 'about',
    subtitle: 'A non-profit organisation based in Pinhel, Portugal.',
  },
};
