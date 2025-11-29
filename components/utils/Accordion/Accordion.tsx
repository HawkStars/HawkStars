'use client';

import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';

type AccordionProps = {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

const Accordion = ({ title, defaultOpen = false, children }: AccordionProps) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  return (
    <div className='flex flex-col'>
      <div
        className={cn('border-disabled flex w-full gap-4 border-b pb-1')}
        onClick={() => setOpen(!open)}
      >
        <div className='my-auto'></div>
        <h6 className='lg:text-h2_bold text-body_semibold'>{title}</h6>
      </div>
      {open && <div className='lg:text-h2_light text-body_regular my-4 flex'>{children}</div>}
    </div>
  );
};

export default Accordion;
