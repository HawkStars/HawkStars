'use client';

import classNames from 'classnames';
import { ReactNode, useState } from 'react';
import { PiCaretDownBold, PiCaretUpBold } from 'react-icons/pi';

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
        className={classNames('flex w-full gap-4 border-b border-disabled pb-1')}
        onClick={() => setOpen(!open)}
      >
        <div className='my-auto'>
          {!open ? (
            <PiCaretDownBold className='lg:text-2xl' />
          ) : (
            <PiCaretUpBold className='lg:text-2xl' />
          )}
        </div>
        <h6 className='lg:text-h2_bold text-h2_light'>{title}</h6>
      </div>
      {open && <div className='lg:text-h2_light text-body_regular my-4 flex'>{children}</div>}
    </div>
  );
};

export default Accordion;
