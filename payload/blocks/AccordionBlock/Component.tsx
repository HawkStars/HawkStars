'use client';

import React from 'react';
import type { AccordionBlock as AccordionBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HawkStarsSection } from '@/components/layout';

export const AccordionBlock: React.FC<AccordionBlockProps> = ({
  title,
  description,
  items = [],
  allowMultiple = false,
  variant = 'default',
  sectionId,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  const defaultOpenItems = items
    .map((item, index) => (item.defaultOpen ? `item-${index}` : null))
    .filter(Boolean) as string[];

  const variantStyles = {
    default: {
      container: '',
      item: 'border-b border-gray-200 data-[state=open]:border-green',
    },
    bordered: {
      container: 'rounded-lg border border-gray-200 overflow-hidden',
      item: 'border-b border-gray-200 last:border-b-0',
    },
    separated: {
      container: 'space-y-3',
      item: 'rounded-lg border border-gray-200 bg-white shadow-sm data-[state=open]:border-green data-[state=open]:shadow-md',
    },
  };

  const styles = variantStyles[variant as keyof typeof variantStyles] || variantStyles.default;

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      container
      id={sectionId || undefined}
      data-blockId='accordion'
    >
      {(title || description) && (
        <div className='section-header text-center'>
          {title && (
            <h2 className='mb-4 text-3xl font-bold tracking-tight text-balance lg:text-4xl'>
              {title}
            </h2>
          )}
          {description && (
            <p className='mx-auto max-w-2xl text-lg leading-relaxed text-gray-600'>{description}</p>
          )}
        </div>
      )}

      <div className='mx-auto'>
        {allowMultiple ? (
          <Accordion type='multiple' defaultValue={defaultOpenItems} className={styles.container}>
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={cn(styles.item, variant === 'separated' && 'mx-0')}
              >
                <AccordionTrigger className='hover:text-green data-[state=open]:text-green px-4 text-left text-base font-semibold hover:no-underline lg:text-lg'>
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className='px-4 text-gray-700'>
                  {item.content && <p className='whitespace-pre-wrap'>{item.content}</p>}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Accordion
            type='single'
            defaultValue={defaultOpenItems[0]}
            collapsible
            className={styles.container}
          >
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={cn(styles.item, variant === 'separated' && 'mx-0')}
              >
                <AccordionTrigger className='hover:text-green data-[state=open]:text-green px-4 text-left text-base font-semibold hover:no-underline lg:text-lg'>
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className='px-4 text-gray-700'>
                  {item.content && <p className='whitespace-pre-wrap'>{item.content}</p>}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </HawkStarsSection>
  );
};
