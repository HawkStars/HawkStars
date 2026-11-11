'use client';

import { useState } from 'react';
import { LuCheck, LuCopy } from 'react-icons/lu';
import { Button } from '@/components/ui/button';

type CopyButtonProps = {
  text: string;
  label: string;
  copiedLabel: string;
};

/** Copies `text` to the clipboard and confirms for two seconds. */
export const CopyButton = ({ text, label, copiedLabel }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (permissions, insecure context): the text stays selectable.
    }
  };

  return (
    <Button type='button' variant='outline' size='sm' onClick={copy} aria-live='polite'>
      {copied ? (
        <LuCheck aria-hidden='true' className='size-4' />
      ) : (
        <LuCopy aria-hidden='true' className='size-4' />
      )}
      {copied ? copiedLabel : label}
    </Button>
  );
};
