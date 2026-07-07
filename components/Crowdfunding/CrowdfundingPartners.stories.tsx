import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { CrowdfundingSetting } from '@/payload-types';
import { useTranslation } from '@/i18n/client';
import AppProvider from '@/utils/contexts/AppProvider';
import CrowdfundingPartners from './CrowdfundingPartners';

const supporters: CrowdfundingSetting['supporters'] = [
  { id: '1', name: 'Câmara de Pinhel', subname: 'Município', type: 'company', logo: null },
  { id: '2', name: 'Maria Silva', subname: 'Madrinha', type: 'person', logo: null },
  { id: '3', name: 'TechCorp', subname: 'Patrocinador', type: 'company', logo: null },
  { id: '4', name: 'João Costa', subname: 'Doador', type: 'person', logo: null },
] as CrowdfundingSetting['supporters'];

const PartnersWithT = (props: Omit<React.ComponentProps<typeof CrowdfundingPartners>, 't'>) => {
  const { t } = useTranslation('en', 'crowdfunding');
  return <CrowdfundingPartners {...props} t={t} />;
};

const meta = {
  title: 'Crowdfunding/Sections/Partners',
  component: PartnersWithT,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <Story />
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof PartnersWithT>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    supporters,
  },
};

export const NoSupporters: Story = {
  args: {
    supporters: [] as CrowdfundingSetting['supporters'],
  },
};
