'use client';

import MarkdownPreview, { MarkdownPreviewProps } from '@uiw/react-markdown-preview';
import React from 'react';

type ReactMarkdownProps = Pick<MarkdownPreviewProps, 'className' | 'source'>;

const MarkdownViewer: React.FC<ReactMarkdownProps> = ({ source, className }) => {
  return (
    <MarkdownPreview
      className={className}
      source={source || ''}
      wrapperElement={{
        'data-color-mode': 'light',
      }}
    />
  );
};

export default MarkdownViewer;
