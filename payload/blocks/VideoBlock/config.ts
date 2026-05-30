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
      label: { en: 'Video URL', pt: 'URL do Vídeo' },
      admin: {
        description: 'YouTube, Vimeo, or direct video URL (mp4, webm, ogg)',
      },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: { en: 'Title', pt: 'Título' },
      admin: {
        description: 'Optional title for the video',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      localized: true,
      label: { en: 'Caption', pt: 'Legenda' },
      admin: {
        description: 'Optional caption or description',
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: false,
      label: { en: 'Autoplay', pt: 'Reprodução Automática' },
      admin: {
        description: 'Auto-play video when visible',
      },
    },
    {
      name: 'loop',
      type: 'checkbox',
      defaultValue: false,
      label: { en: 'Loop', pt: 'Repetir' },
      admin: {
        description: 'Loop video playback',
      },
    },
    {
      name: 'muted',
      type: 'checkbox',
      defaultValue: true,
      label: { en: 'Muted', pt: 'Sem Som' },
      admin: {
        description: 'Mute video by default (required for autoplay)',
      },
    },
    {
      name: 'controls',
      type: 'checkbox',
      defaultValue: true,
      label: { en: 'Show Controls', pt: 'Mostrar Controlos' },
      admin: {
        description: 'Show video controls',
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Video Blocks', pt: 'Blocos de Vídeo' },
    singular: { en: 'Video Block', pt: 'Bloco de Vídeo' },
  },
};
