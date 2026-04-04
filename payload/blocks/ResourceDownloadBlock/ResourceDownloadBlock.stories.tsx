import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ResourceDownloadBlock } from './Component';

const meta: Meta<typeof ResourceDownloadBlock> = {
  title: 'Cards/Resource Download Block',
  component: ResourceDownloadBlock,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    variation: {
      control: { type: 'select' },
      options: ['list', 'card'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ResourceDownloadBlock>;

export const Default: Story = {
  args: {
    title: 'Download Resources',
    resources: [
      {
        title: 'Annual Report 2023',
        description: 'Our comprehensive annual report showcasing impact and financials.',
        file: '/downloads/annual-report.pdf',
        fileType: 'pdf',
        id: '1',
      },
      {
        title: 'Membership Application',
        description: 'Fill out this form to become a member of our organization.',
        file: '/downloads/membership-form.pdf',
        fileType: 'pdf',
        id: '2',
      },
      {
        title: 'Program Guidelines',
        description: 'Detailed guidelines for all our youth programs and activities.',
        file: '/downloads/program-guidelines.doc',
        fileType: 'doc',
        id: '3',
      },
    ],
    id: '1',
    variation: 'list',
  },
};
