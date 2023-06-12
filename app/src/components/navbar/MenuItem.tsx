"use client";

import { Menu } from "@headlessui/react";

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
        <Menu.Items className="z-100 absolute mt-3 flex flex-col gap-2 rounded">
          {options.map((option, index) => (
            <Menu.Item
              key={index}
              disabled={option.disabled}
              as="div"
              className="w-64 px-3"
            >
              {({ active }) => (
                <a
                  className={`${active && "bg-blue-500"}`}
                  href="/account-settings"
                >
                  {option.text}
                </a>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default MenuItem;
