"use client";

import classNames from "classnames";
import { useState } from "react";
import { PiCaretDownBold, PiCaretUpBold } from "react-icons/pi";

type AccordionProps = {
  title: string;
  description: string;
  defaultOpen?: boolean;
};

const Accordion = ({
  title,
  description,
  defaultOpen = false,
}: AccordionProps) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  return (
    <div
      className={classNames("flex flex-col", {
        "border-b-2 border-disabled": open,
      })}
    >
      <div
        className={classNames("flex gap-4", {
          "border-b-2 border-disabled pb-2": !open,
        })}
        onClick={() => setOpen(!open)}
      >
        <div>
          {!open ? <PiCaretDownBold size={24} /> : <PiCaretUpBold size={24} />}
        </div>
        <h6>{title}</h6>
      </div>
      {open && (
        <div className="my-4 flex">
          <p className="font-body text-justify">{description}</p>
        </div>
      )}
    </div>
  );
};

export default Accordion;
