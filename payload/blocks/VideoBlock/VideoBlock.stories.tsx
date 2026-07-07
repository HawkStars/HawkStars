import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { VideoBlock } from './Component';

const meta: Meta<typeof VideoBlock> = {
  title: 'Blocks/Media/Video',
  component: VideoBlock,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    autoplay: { control: 'boolean', description: 'Start playing automatically (requires muted)' },
    loop: { control: 'boolean', description: 'Loop the video indefinitely' },
    muted: { control: 'boolean', description: 'Mute audio (required for autoplay to work)' },
    controls: { control: 'boolean', description: 'Show player controls' },
    title: { control: 'text' },
    caption: { control: 'text' },
    videoUrl: { control: 'text' },
    blockType: { table: { disable: true } },
    id: { table: { disable: true } },
    blockName: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof VideoBlock>;

export const YouTubeVideo: Story = {
  args: {
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Sample YouTube Video',
    caption: 'This is a demonstration of the YouTube video embed.',
    autoplay: false,
    loop: false,
    muted: true,
    controls: true,
    id: '1',
    blockName: 'VideoBlock',
    blockType: 'videoBlock',
  },
};

export const VimeoVideo: Story = {
  args: {
    videoUrl: 'https://vimeo.com/148751763',
    title: 'Vimeo Video Example',
    caption: 'A beautiful video hosted on Vimeo.',
    autoplay: false,
    loop: false,
    muted: true,
    controls: true,
    id: '2',
    blockName: 'VideoBlock',
    blockType: 'videoBlock',
  },
};

export const DirectVideo: Story = {
  args: {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Direct Video File',
    caption: 'A direct MP4 video file embedded in the page.',
    autoplay: false,
    loop: false,
    muted: true,
    controls: true,
    id: '3',
    blockName: 'VideoBlock',
    blockType: 'videoBlock',
  },
};

export const AutoplayMuted: Story = {
  args: {
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Autoplay + Looping Video',
    caption: 'Plays and loops automatically (muted, as required by browsers).',
    autoplay: true,
    loop: true,
    muted: true,
    controls: true,
    id: '4',
    blockName: 'VideoBlock',
    blockType: 'videoBlock',
  },
};

export const NoControls: Story = {
  args: {
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Video Without Controls',
    autoplay: false,
    loop: false,
    muted: true,
    controls: false,
    id: '5',
    blockName: 'VideoBlock',
    blockType: 'videoBlock',
  },
};

export const NoTitleOrCaption: Story = {
  args: {
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    autoplay: false,
    loop: false,
    muted: true,
    controls: true,
    id: '6',
    blockName: 'VideoBlock',
    blockType: 'videoBlock',
  },
};
