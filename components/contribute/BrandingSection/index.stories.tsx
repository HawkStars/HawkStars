import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { globalVillageLogo } from '@/utils/models/images/logos';
import BrandingSection from './index';

const meta = {
  title: 'Donation/Branding Section',
  component: BrandingSection,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='mx-auto max-w-md'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BrandingSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    image: globalVillageLogo,
    altImage: 'Naming opportunity',
    title: 'Name the Training Room',
    price: '€5,000',
    description:
      'Have your name or your company branding permanently displayed in our main training room.',
  },
};

export const LongTitle: Story = {
  args: {
    ...Default.args,
    title: 'Name the Main Auditorium and Cultural Performance Space',
    price: '€25,000',
  },
};
