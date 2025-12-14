import type { Meta, StoryObj } from '@storybook/react';
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';

import { GlobalVillageAboutSectionBlockComponent as GlobalVillageAboutSectionBlock } from './Component';

const meta: Meta<typeof GlobalVillageAboutSectionBlock> = {
  title: 'Payload Blocks/GlobalVillageAboutSection',
  component: GlobalVillageAboutSectionBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof GlobalVillageAboutSectionBlock>;

const makeSectionContent = (text: string): DefaultTypedEditorState => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text,
            version: 1,
            format: 0,
            detail: 0,
            mode: 'normal' as const,
            style: '',
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        textFormat: 0,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
});

export const Default: Story = {
  args: {
    heading: 'The Global Village',
    description:
      'We foster collaborative ecosystems that empower creative leaders and cultural practitioners around the world.',
    sections: [
      {
        id: 'section-1',
        title: 'Co-Creation Labs',
        content: makeSectionContent(
          'Immersive programs that connect artists and innovators to mentor emerging leaders globally.'
        ),
        imageField: {
          imageType: 'external',
          externalImage: 'https://placehold.co/600x400?text=Co-Creation',
          alt: 'Collaborative session with creative leaders',
        },
      },
      {
        id: 'section-2',
        title: 'Community Builders',
        content: makeSectionContent(
          'Grassroots initiatives that strengthen cultural infrastructure across villages and cities.'
        ),
        imageField: {
          imageType: 'external',
          externalImage: 'https://placehold.co/600x400?text=Community',
          alt: 'Community gathering in a cultural hub',
        },
      },
      {
        id: 'section-3',
        title: 'Global Exchanges',
        content: makeSectionContent(
          'Residencies and exchange programs designed to amplify diverse voices and shared learning.'
        ),
        imageField: {
          imageType: 'external',
          externalImage: 'https://placehold.co/600x400?text=Exchange',
          alt: 'Artists collaborating in an international program',
        },
      },
    ],
    cta: {
      enable: true,
      link: {
        type: 'custom',
        label: 'Support the Vision',
        url: '/support',
        newTab: false,
      },
    },
    id: 'block-1',
    blockName: 'GlobalVillageAboutSection',
    blockType: 'globalVillageAboutSection',
  },
};

export const WithoutCTA: Story = {
  args: {
    ...Default.args,
    cta: {
      enable: false,
      link: {
        type: 'custom',
        label: 'Support the Vision',
        url: '/support',
      },
    },
  },
};
