import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OffsetSection } from './OffsetSection';

const DemoContent = ({ dark }: { dark?: boolean }) => (
  <div className='px-4 py-12 text-center xl:px-40'>
    <h2 className={dark ? 'text-h2_bold text-white' : 'text-h2_bold text-green'}>
      Offset section
    </h2>
    <p className={dark ? 'mt-2 text-white/80' : 'text-disabled mt-2'}>
      This block uses negative horizontal margins so its background bleeds to the page edges.
    </p>
  </div>
);

const meta = {
  title: 'Misc/OffsetSection',
  component: OffsetSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    bgColor: { control: 'select', options: ['bege-light', 'bege-dark', 'white', 'green'] },
  },
  decorators: [
    (Story) => (
      <div className='bg-white px-4 py-8 xl:px-40'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OffsetSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <DemoContent />,
  },
};

export const BegeLight: Story = {
  args: {
    bgColor: 'bege-light',
    children: <DemoContent />,
  },
};

export const BegeDark: Story = {
  args: {
    bgColor: 'bege-dark',
    children: <DemoContent />,
  },
};

export const Green: Story = {
  args: {
    bgColor: 'green',
    children: <DemoContent dark />,
  },
};
