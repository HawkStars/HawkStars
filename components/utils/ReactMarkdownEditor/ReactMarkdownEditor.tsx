import React, { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

type ReactMarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ReactMarkdownEditor({ value, onChange }: ReactMarkdownEditorProps) {
  const handleOnChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <div className='container'>
      <MDEditor value={value} onChange={handleOnChange} />
    </div>
  );
}
