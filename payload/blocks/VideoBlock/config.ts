import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const VideoBlock: Block = {
  slug: 'videoBlock',
  interfaceName: 'VideoBlock',
  admin: {
    group: 'Media',
  },
  fields: [
    {
      name: 'videoUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'YouTube, Vimeo, or direct video URL (mp4, webm, ogg)',
      },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: {
        description: 'Optional title for the video',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Optional caption or description',
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Auto-play video when visible',
      },
    },
    {
      name: 'loop',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Loop video playback',
      },
    },
    {
      name: 'muted',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Mute video by default (required for autoplay)',
      },
    },
    {
      name: 'controls',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show video controls',
      },
    },
    SectionID,
  ],
  labels: {
    plural: 'Video Blocks',
    singular: 'Video Block',
  },
};
