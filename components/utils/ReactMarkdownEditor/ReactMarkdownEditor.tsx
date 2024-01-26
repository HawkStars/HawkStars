import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

type ReactMarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ReactMarkdownEditor({ value, onChange }: ReactMarkdownEditorProps) {
  const [text, setText] = useState<string | undefined>(value);

  const handleOnChange = (value: string | undefined) => {
    setText(value);
    onChange(value || '');
  };

  return (
    <div className='container'>
      <MDEditor value={text} onChange={handleOnChange} />
    </div>
  );
}
