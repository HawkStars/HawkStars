import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ContactChannelsBlock } from './Component';
import type { ContactChannelsBlock as ContactChannelsBlockType } from '@/payload-types';

type Icon = NonNullable<ContactChannelsBlockType['channels']>[number]['icon'];

const meta: Meta<typeof ContactChannelsBlock> = {
  title: 'Blocks/CTA/Contact Channels',
  component: ContactChannelsBlock,
  parameters: { layout: 'fullscreen' },
  argTypes: { background: { control: 'select', options: ['ink', 'green', 'bege'] } },
};

export default meta;
type Story = StoryObj<typeof ContactChannelsBlock>;

export const Ink: Story = {
  args: {
    blockType: 'contactChannels',
    lng: 'pt',
    eyebrow: 'Tens uma preocupação?',
    title: 'Como reportar',
    description:
      'Se uma criança estiver em perigo imediato, liga 112. Para qualquer outra preocupação, contacta-nos.',
    background: 'ink',
    channels: [
      { id: '1', icon: 'LuSiren' as Icon, label: 'Emergência', value: '112', href: 'tel:112' },
      {
        id: '2',
        icon: 'LuPhone' as Icon,
        label: 'Linha SOS-Criança',
        value: '116 111',
        href: 'tel:116111',
      },
      {
        id: '3',
        icon: 'LuMail' as Icon,
        label: 'Hawk Stars',
        value: 'geral@hawkstars.org',
        href: 'mailto:geral@hawkstars.org',
      },
    ],
  },
};

export const Bege: Story = { args: { ...Ink.args, background: 'bege' } };
