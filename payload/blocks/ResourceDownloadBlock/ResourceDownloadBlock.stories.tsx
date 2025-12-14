import type { Meta, StoryObj } from '@storybook/react';
import { ResourceDownloadBlock } from './Component';

const meta: Meta<typeof ResourceDownloadBlock> = {
  title: 'Payload Blocks/ResourceDownloadBlock',
  component: ResourceDownloadBlock,
  parameters: {
    layout: 'fullscreen',
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
        file: {
          url: '/downloads/annual-report.pdf',
          filename: 'annual-report-2023.pdf',
        },
        fileType: 'pdf',
        id: '1',
      },
      {
        title: 'Membership Application',
        description: 'Fill out this form to become a member of our organization.',
        file: {
          url: '/downloads/membership-form.pdf',
          filename: 'membership-form.pdf',
        },
        fileType: 'pdf',
        id: '2',
      },
      {
        title: 'Program Guidelines',
        description: 'Detailed guidelines for all our youth programs and activities.',
        file: {
          url: '/downloads/program-guidelines.doc',
          filename: 'program-guidelines.doc',
        },
        fileType: 'doc',
        id: '3',
      },
    ],
    id: '1',
    blockName: 'ResourceDownloadBlock',
    blockType: 'resourceDownload',
  },
};
