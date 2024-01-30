import React, { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

type ReactMarkdownEditorProps = {
  value: string;
  label?: string;
  onChange: (value: string) => void;
};

export default function ReactMarkdownEditor({ value, label, onChange }: ReactMarkdownEditorProps) {
  const handleOnChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <div className='flex flex-col gap-3'>
      <h6>{label}</h6>
      <MDEditor value={value} onChange={handleOnChange} />
    </div>
  );
}
