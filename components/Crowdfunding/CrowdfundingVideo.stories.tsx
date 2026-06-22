import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useTranslation } from '@/i18n/client';
import AppProvider from '@/utils/contexts/AppProvider';
import CrowdfundingVideo from './CrowdfundingVideo';

const VideoWithT = (props: Omit<React.ComponentProps<typeof CrowdfundingVideo>, 't'>) => {
  const { t } = useTranslation('en', 'crowdfunding');
  return <CrowdfundingVideo {...props} t={t} />;
};

const meta = {
  title: 'Crowdfunding/CrowdfundingVideo',
  component: VideoWithT,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <Story />
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof VideoWithT>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithVideo: Story = {
  args: {
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoThumbnail: null,
    supportUrl: '#support',
  },
};

export const ThumbnailOnly: Story = {
  args: {
    videoUrl: null,
    videoThumbnail: null,
    supportUrl: '#support',
  },
};
