import React from 'react';

import type { TextBlock as TextBlockProps } from '@/payload-types';

import RichText from '@/payload/components/RichText';
import { cn } from '@/payload/utilities/ui';

export const TextBlock: React.FC<TextBlockProps> = ({
  content,
  textAlign = 'left',
  maxWidth = 'large',
}) => {
  const getMaxWidthClasses = (width: string | null) => {
    switch (width) {
      case 'full':
        return 'w-full';
      case 'large':
        return 'max-w-[1200px] mx-auto';
      case 'medium':
        return 'max-w-[800px] mx-auto';
      case 'small':
        return 'max-w-[600px] mx-auto';
      default:
        return 'max-w-[1200px] mx-auto';
    }
  };

  const getTextAlignClasses = (align: string | null) => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      case 'justify':
        return 'text-justify';
      default:
        return 'text-left';
    }
  };

  return (
    <div className='container py-8'>
      <div className={cn('w-full', getMaxWidthClasses(maxWidth), getTextAlignClasses(textAlign))}>
        {content && <RichText data={content} className='no-padding' />}
      </div>
    </div>
  );
};
