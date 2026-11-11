import React from 'react';
import type { AccordionBlock as AccordionBlockProps } from '@/payload-types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';

// Warm `bege-dark` hairlines instead of cold grey; the open item picks up the brand green.
const variantStyles = {
  default: {
    container: '',
    item: 'border-b border-bege-dark data-[state=open]:border-green',
  },
  bordered: {
    container: 'overflow-hidden rounded-xl border border-bege-dark bg-white',
    item: 'border-b border-bege-dark last:border-b-0',
  },
  separated: {
    container: 'space-y-3',
    item: 'mx-0 rounded-xl border border-bege-dark bg-white shadow-sm transition-shadow data-[state=open]:border-green data-[state=open]:shadow-md',
  },
} as const;

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

  const styles = variantStyles[variant as keyof typeof variantStyles] || variantStyles.default;

  const renderedItems = items.map((item, index) => (
    <AccordionItem key={item.id || index} value={`item-${index}`} className={styles.item}>
      <AccordionTrigger className='hover:text-green data-[state=open]:text-green text-h3_semibold min-h-11 px-4 font-semibold hover:no-underline'>
        {item.title}
      </AccordionTrigger>
      <AccordionContent className='text-body_regular max-w-prose px-4 leading-relaxed text-black/80'>
        {item.content && <p className='whitespace-pre-line'>{item.content}</p>}
      </AccordionContent>
    </AccordionItem>
  ));

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='accordion'
    >
      {(title || description) && (
        <SectionHeader
          reveal
          align='center'
          title={title}
          subtitle={description}
          className='section-header'
        />
      )}

      {/* A 3xl column keeps answers at a readable line length instead of spanning the page. */}
      <div className='mx-auto max-w-3xl'>
        {allowMultiple ? (
          <Accordion type='multiple' defaultValue={defaultOpenItems} className={styles.container}>
            {renderedItems}
          </Accordion>
        ) : (
          <Accordion
            type='single'
            defaultValue={defaultOpenItems[0]}
            collapsible
            className={styles.container}
          >
            {renderedItems}
          </Accordion>
        )}
      </div>
    </HawkStarsSection>
  );
};
