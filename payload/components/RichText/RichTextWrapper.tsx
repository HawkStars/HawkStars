'use client';

import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import RichText from '.';

export type RichTextProps = {
  data: DefaultTypedEditorState;
} & React.HTMLAttributes<HTMLDivElement>;

const RichTextWrapper = (props: RichTextProps) => {
  return <RichText {...props} />;
};

export default RichTextWrapper;
