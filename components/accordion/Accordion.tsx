'use client';

import classNames from 'classnames';
import { ReactNode, useState } from 'react';
import { PiCaretDownBold, PiCaretUpBold } from 'react-icons/pi';

type AccordionProps = {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

const Accordion = ({
  title,
  defaultOpen = false,
  children,
}: AccordionProps) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  return (
    <div className='flex flex-col'>
      <div
        className={classNames('flex gap-4 border-b border-disabled pb-1')}
        onClick={() => setOpen(!open)}
      >
        <div>
          {!open ? <PiCaretDownBold size={24} /> : <PiCaretUpBold size={24} />}
        </div>
        <h6 className='font-bold'>{title}</h6>
      </div>
      {open && <div className='my-4 flex'>{children}</div>}
    </div>
  );
};

export default Accordion;
