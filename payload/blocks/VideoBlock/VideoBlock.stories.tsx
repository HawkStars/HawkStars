import type { Meta, StoryObj } from '@storybook/react';
import { VideoBlock } from './Component';

const meta: Meta<typeof VideoBlock> = {
  title: 'Media/VideoBlock',
  component: VideoBlock,
  parameters: {
    layout: 'fullscreen',
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
    title: 'Autoplay Video',
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
