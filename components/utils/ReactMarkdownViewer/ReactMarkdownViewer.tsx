import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ReactMarkdownProps {
  source: string;
}

const MarkdownViewer: React.FC<ReactMarkdownProps> = ({ source }) => {
  return <ReactMarkdown>{source}</ReactMarkdown>;
};

export default MarkdownViewer;
