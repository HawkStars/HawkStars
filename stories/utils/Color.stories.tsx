import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Utils/Colors',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ColorSwatch = ({
  name,
  hex,
  tailwindClass,
}: {
  name: string;
  hex: string;
  tailwindClass: string;
}) => (
  <div className='flex flex-col items-center'>
    <div className={`h-32 w-32 rounded-lg border border-gray-300 ${tailwindClass}`} />
    <p className='mt-2 text-sm font-semibold'>{name}</p>
    <p className='text-xs text-gray-600'>{hex}</p>
  </div>
);

export const AllColors: Story = {
  render: () => (
    <div className='space-y-8 p-8'>
      <h1 className='text-2xl font-bold'>Color System</h1>

      <div>
        <h2 className='mb-4 text-lg font-semibold'>Beige</h2>
        <div className='grid grid-cols-2 gap-8 lg:grid-cols-4'>
          <ColorSwatch name='Bege Light' hex='#F5EFE7' tailwindClass='bg-bege-light' />
          <ColorSwatch name='Bege Dark' hex='#D4C4B0' tailwindClass='bg-bege-dark' />
        </div>
      </div>

      <div>
        <h2 className='mb-4 text-lg font-semibold'>Green</h2>
        <div className='grid grid-cols-2 gap-8 lg:grid-cols-4'>
          <ColorSwatch name='Green' hex='#5D7A5C' tailwindClass='bg-green' />
        </div>
      </div>

      <div>
        <h2 className='mb-4 text-lg font-semibold'>Neutrals</h2>
        <div className='grid grid-cols-2 gap-8 lg:grid-cols-4'>
          <ColorSwatch name='Black' hex='#1A1A1A' tailwindClass='bg-black' />
          <ColorSwatch name='White' hex='#FFFFFF' tailwindClass='bg-white border border-gray-300' />
          <ColorSwatch name='Gray' hex='#9CA3AF' tailwindClass='bg-gray-400' />
        </div>
      </div>
    </div>
  ),
};
