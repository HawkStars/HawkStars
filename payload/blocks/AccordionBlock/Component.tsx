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

export const AccordionBlock: React.FC<AccordionBlockProps> = ({
  title,
  description,
  items = [],
  allowMultiple = false,
  variant = 'default',
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
      item: 'border-b border-gray-200',
    },
    bordered: {
      container: 'rounded-lg border border-gray-200',
      item: 'border-b border-gray-200 last:border-b-0',
    },
    separated: {
      container: 'space-y-3',
      item: 'rounded-lg border border-gray-200 bg-white',
    },
  };

  const styles = variantStyles[variant as keyof typeof variantStyles] || variantStyles.default;

  return (
    <section className='py-12 lg:py-20'>
      <div className='container mx-auto'>
        {(title || description) && (
          <div className='mb-10 text-center'>
            {title && <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>}
            {description && (
              <p className='mx-auto max-w-2xl text-lg text-gray-600'>{description}</p>
            )}
          </div>
        )}

        <div className='mx-auto max-w-3xl'>
          {allowMultiple ? (
            <Accordion type='multiple' defaultValue={defaultOpenItems} className={styles.container}>
              {items.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className={cn(styles.item, variant === 'separated' && 'mx-0')}
                >
                  <AccordionTrigger className='px-4 text-left text-base font-semibold hover:no-underline lg:text-lg'>
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
                  <AccordionTrigger className='px-4 text-left text-base font-semibold hover:no-underline lg:text-lg'>
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
      </div>
    </section>
  );
};
