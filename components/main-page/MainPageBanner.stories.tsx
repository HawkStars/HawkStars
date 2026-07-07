import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MainPageBanner from './MainPageBanner';

const meta = {
  title: 'Pages/Home/Main Page Banner',
  component: MainPageBanner,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      // The banner is absolutely positioned, so give it a relative host.
      <div className='relative h-24 w-full'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MainPageBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    bannerText: 'Support our new headquarters — every contribution counts.',
    bannerColor: '#1b6b3a',
    bannerButtonText: 'Donate',
    bannerButtonLink: 'https://hawkstars.org/contribute',
  },
};

export const LightBackground: Story = {
  args: {
    bannerText: 'Join us at the Pinhel Cultural Festival this August.',
    bannerColor: '#f5e7c8',
    bannerButtonText: 'Learn more',
    bannerButtonLink: 'https://hawkstars.org/agenda',
  },
};

export const TextOnly: Story = {
  args: {
    bannerText: 'Our offices will be closed on national holidays.',
    bannerColor: '#1b6b3a',
  },
};
