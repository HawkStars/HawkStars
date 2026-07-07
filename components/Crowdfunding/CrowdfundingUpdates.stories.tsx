import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { CrowdfundingSetting } from '@/payload-types';
import { useTranslation } from '@/i18n/client';
import AppProvider from '@/utils/contexts/AppProvider';
import CrowdfundingUpdates from './CrowdfundingUpdates';

const updateCards: CrowdfundingSetting['updateCards'] = [
  {
    id: '1',
    title: 'Construction has begun!',
    date: '2025-03-12T00:00:00.000Z',
    image: null,
    instagramUrl: 'https://instagram.com/p/example1',
  },
  {
    id: '2',
    title: 'New partnership announced',
    date: '2025-02-28T00:00:00.000Z',
    image: null,
    instagramUrl: null,
  },
  {
    id: '3',
    title: 'Goal reached: 25%',
    date: '2025-02-10T00:00:00.000Z',
    image: null,
    instagramUrl: 'https://instagram.com/p/example3',
  },
] as unknown as CrowdfundingSetting['updateCards'];

const UpdatesWithT = (props: Omit<React.ComponentProps<typeof CrowdfundingUpdates>, 't'>) => {
  const { t } = useTranslation('en', 'crowdfunding');
  return <CrowdfundingUpdates {...props} t={t} />;
};

const meta = {
  title: 'Crowdfunding/Sections/Updates',
  component: UpdatesWithT,
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
} satisfies Meta<typeof UpdatesWithT>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    updateCards,
  },
};
