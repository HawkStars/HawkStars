import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Case } from '@/components/ui/cases-with-infinite-scroll';

const meta = {
  title: 'UI/CasesWithInfiniteScroll',
  component: Case,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Case>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
