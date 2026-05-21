import {
  DefaultTypedEditorState,
  SerializedHeadingNode,
  SerializedHorizontalRuleNode,
  SerializedParagraphNode,
  SerializedTextNode,
} from '@payloadcms/richtext-lexical';

export const createPayloadExternalImage = (type: 'external', url: string, alt: string) => ({
  imageType: type,
  externalImage: url,
  alt: alt,
});

export const createPayloadLink = (
  type: 'custom' | 'reference',
  url: string,
  newTab: boolean,
  label: string
) => ({
  type,
  url,
  newTab,
  label,
});

const sampleRichTextDescription: SerializedParagraphNode = {
  type: 'paragraph',
  textFormat: 0,
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  children: [
    {
      type: 'heading',
      level: 2,
      textFormat: 0,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'text',
          text: 'Sample Heading',
          format: '',
          mode: 'normal',
          version: 1,
        } as unknown as SerializedTextNode,
      ],
    } as unknown as SerializedHeadingNode,
    {
      type: 'text',
      text: 'This is a sample rich text description with a ',
      format: '',
      mode: 'normal',
      version: 1,
    } as unknown as SerializedTextNode,
    {
      type: 'horizontalrule',
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    } as unknown as SerializedHorizontalRuleNode,
    {
      type: 'text',
      text: 'This is a sample rich text description with a ',
      format: '',
      indent: 1,
      version: 1,
    } as unknown as SerializedTextNode,
  ],
};

export const sampleRichTextWithDescription: DefaultTypedEditorState = {
  root: {
    type: 'root',
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    children: [sampleRichTextDescription] as unknown as DefaultTypedEditorState['root']['children'],
  },
};
