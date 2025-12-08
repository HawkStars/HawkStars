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

export const AccordionBlock: React.FC<AccordionBlockProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  const isMultiple = items.filter((item) => item.defaultOpen).length > 1;

  const accordionItems = items.map((item, index) => (
    <AccordionItem key={item.id} value={item.id || index.toString()}>
      <AccordionTrigger>{item.title}</AccordionTrigger>
      <AccordionContent className='flex flex-col gap-4 text-balance'>
        <RichText data={item.content} />
      </AccordionContent>
    </AccordionItem>
  ));

  if (isMultiple) {
    const defaultValue = items
      .filter((item) => item.defaultOpen)
      .map((item) => item.id)
      .filter(Boolean) as string[];

    return (
      <Accordion
        className='my-10 w-full'
        type='multiple'
        defaultValue={defaultValue.length > 0 ? defaultValue : undefined}
      >
        {accordionItems}
      </Accordion>
    );
  }

  const defaultValue = items.find((item) => item.defaultOpen)?.id || undefined;

  return (
    <Accordion
      collapsible
      className='my-10 w-full'
      type='single'
      defaultValue={defaultValue || undefined}
    >
      {accordionItems}
    </Accordion>
  );
};
