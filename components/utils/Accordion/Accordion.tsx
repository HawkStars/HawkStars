'use client';

import { cn } from '@/lib/utils';
import { ReactNode, useId, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

type AccordionProps = {
  title: string;
  defaultOpen?: boolean;
  /** Match the surrounding outline; heading levels must not skip (axe heading-order). */
  headingLevel?: 'h3' | 'h4' | 'h5' | 'h6';
  children: ReactNode;
};

// A11Y-H4: the header was a `<div onClick>` — the panel was unreachable by
// keyboard and exposed no expanded state. It is now the standard accordion
// pattern: a heading containing a <button aria-expanded aria-controls>, and a
// labelled region for the panel.
const Accordion = ({
  title,
  defaultOpen = false,
  headingLevel: Heading = 'h6',
  children,
}: AccordionProps) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const id = useId();
  const buttonId = `${id}-trigger`;
  const panelId = `${id}-panel`;

  return (
    <div className='flex flex-col'>
      <Heading className='text-body_semibold'>
        <button
          type='button'
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
          className={cn(
            'border-disabled focus-visible:ring-ring flex w-full cursor-pointer items-center gap-4 border-b pb-1 text-left focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden'
          )}
        >
          <span className='flex-1'>{title}</span>
          <LuChevronDown
            aria-hidden='true'
            className={cn('my-auto shrink-0 transition-transform duration-300', {
              'rotate-180': open,
            })}
          />
        </button>
      </Heading>
      <div
        id={panelId}
        role='region'
        aria-labelledby={buttonId}
        hidden={!open}
        className='mt-3 flex flex-col gap-2'
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
