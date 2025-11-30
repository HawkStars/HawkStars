'use client';

import React from 'react';
import RichText from '@/payload/components/RichText';
import type { AccordionBlock as AccordionBlockProps } from '@/payload-types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const AccordionBlock: React.FC<AccordionBlockProps> = ({
  items,
  allowMultipleOpen = false,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <Accordion
      type={allowMultipleOpen ? 'multiple' : 'single'}
      collapsible={!allowMultipleOpen}
      className='my-10 w-full'
    >
      {items.map((item, index: number) => {
        return (
          <AccordionItem key={index} value={index.toString()}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 text-balance'>
              <RichText data={item.content} padding='none' />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
