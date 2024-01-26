import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ReactMarkdownProps {
  source: string;
}

const Markdown: React.FC<ReactMarkdownProps> = ({ source }) => {
  return <ReactMarkdown>{source}</ReactMarkdown>;
};

export default Markdown;
