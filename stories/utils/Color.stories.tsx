import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Utils/Colors',
  parameters: {
    layout: 'padded',
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
    <div className={`h-20 w-full rounded-lg border border-gray-200 ${tailwindClass}`} />
    <p className='mt-2 text-xs font-semibold'>{name}</p>
    <p className='font-mono text-xs text-gray-500'>{hex}</p>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h2 className='mb-4 border-b pb-1 text-base font-semibold tracking-wide text-gray-500 uppercase'>
      {title}
    </h2>
    <div className='grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6'>{children}</div>
  </div>
);

export const AllColors: Story = {
  render: () => (
    <div className='space-y-10 p-8'>
      <h1 className='text-2xl font-bold'>Color System</h1>

      <Section title='Brand — Core'>
        <ColorSwatch name='Green' hex='#0a7558' tailwindClass='bg-green' />
        <ColorSwatch name='Bege Light' hex='#fef9f6' tailwindClass='bg-bege-light' />
        <ColorSwatch name='Bege Dark' hex='#fae7d0' tailwindClass='bg-bege-dark' />
      </Section>

      <Section title='Neutrals'>
        <ColorSwatch name='White' hex='#ffffff' tailwindClass='bg-white' />
        <ColorSwatch name='Gray Light' hex='#d3d3d3' tailwindClass='bg-gray-light' />
        <ColorSwatch name='Disabled' hex='#5b5b5b' tailwindClass='bg-disabled' />
        <ColorSwatch name='Black' hex='#000000' tailwindClass='bg-black' />
      </Section>

      <Section title='Semantic'>
        <ColorSwatch name='Red Dark' hex='#8b0000' tailwindClass='bg-red-dark' />
        <ColorSwatch name='LinkedIn' hex='#0a66c2' tailwindClass='bg-linkedin' />
      </Section>

      <Section title='Erasmus'>
        <ColorSwatch name='Blue' hex='#003399' tailwindClass='bg-erasmus-blue' />
        <ColorSwatch name='Gold' hex='#ffcc00' tailwindClass='bg-erasmus-gold' />
        <ColorSwatch name='Dark' hex='#0e0c1a' tailwindClass='bg-erasmus-dark' />
        <ColorSwatch name='Muted' hex='#6a6780' tailwindClass='bg-erasmus-muted' />
        <ColorSwatch name='KA1' hex='#4dd9bc' tailwindClass='bg-erasmus-ka1' />
        <ColorSwatch name='KA2' hex='#d18ddf' tailwindClass='bg-erasmus-ka2' />
        <ColorSwatch name='KA3' hex='#f08080' tailwindClass='bg-erasmus-ka3' />
        <ColorSwatch name='JM' hex='#7eb8f7' tailwindClass='bg-erasmus-jm' />
        <ColorSwatch name='Sport' hex='#f0b97a' tailwindClass='bg-erasmus-sport' />
      </Section>

      <Section title='Crowdfunding'>
        <ColorSwatch name='BG' hex='#0d0d0d' tailwindClass='bg-crowdfunding-bg' />
        <ColorSwatch name='Surface' hex='#1a1a1a' tailwindClass='bg-crowdfunding-surface' />
        <ColorSwatch name='Surface Alt' hex='#111111' tailwindClass='bg-crowdfunding-surface-alt' />
      </Section>

      <Section title='Gaming'>
        <ColorSwatch name='BG' hex='#0a0a0f' tailwindClass='bg-gaming-bg' />
        <ColorSwatch name='Surface' hex='#12121a' tailwindClass='bg-gaming-surface' />
        <ColorSwatch name='Surface Light' hex='#1a1a2e' tailwindClass='bg-gaming-surface-light' />
        <ColorSwatch name='Border' hex='#2a2a3e' tailwindClass='bg-gaming-border' />
        <ColorSwatch name='Accent' hex='#00f0ff' tailwindClass='bg-gaming-accent' />
        <ColorSwatch name='Accent 2' hex='#7b2ff7' tailwindClass='bg-gaming-accent-secondary' />
        <ColorSwatch name='Text' hex='#e4e4f0' tailwindClass='bg-gaming-text' />
        <ColorSwatch name='Text Muted' hex='#8888a0' tailwindClass='bg-gaming-text-muted' />
        <ColorSwatch name='Danger' hex='#ff3a5e' tailwindClass='bg-gaming-danger' />
        <ColorSwatch name='Success' hex='#00e676' tailwindClass='bg-gaming-success' />
      </Section>
    </div>
  ),
};
