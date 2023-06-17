"use client";

import { Menu } from "@headlessui/react";
import classNames from "classnames";
import Link from "next/link";

type MenuItemProps = {
  title: string;
  options: NavbarOption[];
};

export type NavbarOption = {
  text: string;
  url?: string;
  disabled: boolean;
};

const MenuItem = ({ title, options }: MenuItemProps) => {
  return (
    <div className="">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button>{title}</Menu.Button>
        <Menu.Items className="z-100 absolute -ml-20 mt-5 flex flex-col gap-2 rounded bg-white">
          {options.map((option, index) => (
            <Menu.Item
              key={index}
              disabled={option.disabled}
              as="div"
              className={classNames("w-64 px-3 py-2", {
                "text-neutral-400": !option.url,
              })}
            >
              <>
                {option.url ? (
                  <Link href={option.url}>{option.text}</Link>
                ) : (
                  <div>{option.text}</div>
                )}
              </>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default MenuItem;
