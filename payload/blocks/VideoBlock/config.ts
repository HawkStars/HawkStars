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
        description: {
          en: 'YouTube, Vimeo, or direct video URL (mp4, webm, ogg)',
          pt: 'URL do YouTube, Vimeo ou URL direto de vídeo (mp4, webm, ogg)',
        },
      },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: { en: 'Title', pt: 'Título' },
      admin: {
        description: { en: 'Optional title for the video', pt: 'Título opcional para o vídeo' },
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      localized: true,
      label: { en: 'Caption', pt: 'Legenda' },
      admin: {
        description: { en: 'Optional caption or description', pt: 'Legenda ou descrição opcional' },
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: false,
      label: { en: 'Autoplay', pt: 'Reprodução Automática' },
      admin: {
        description: {
          en: 'Auto-play video when visible',
          pt: 'Reproduzir automaticamente o vídeo quando visível',
        },
      },
    },
    {
      name: 'loop',
      type: 'checkbox',
      defaultValue: false,
      label: { en: 'Loop', pt: 'Repetir' },
      admin: {
        description: { en: 'Loop video playback', pt: 'Repetir a reprodução do vídeo' },
      },
    },
    {
      name: 'muted',
      type: 'checkbox',
      defaultValue: true,
      label: { en: 'Muted', pt: 'Sem Som' },
      admin: {
        description: {
          en: 'Mute video by default (required for autoplay)',
          pt: 'Silenciar o vídeo por omissão (necessário para reprodução automática)',
        },
      },
    },
    {
      name: 'controls',
      type: 'checkbox',
      defaultValue: true,
      label: { en: 'Show Controls', pt: 'Mostrar Controlos' },
      admin: {
        description: { en: 'Show video controls', pt: 'Mostrar controlos do vídeo' },
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Video Blocks', pt: 'Blocos de Vídeo' },
    singular: { en: 'Video Block', pt: 'Bloco de Vídeo' },
  },
};
