export type NavbarItem = NavbarDropdownMenu | SingleNavbarItem;

export type NavbarDropdownMenu = {
  type: 'dropdown';
  title: string;
  options: NavbarUrlItem[];
};

export type SingleNavbarItem = { type: 'single'; option: NavbarUrlItem };

export type NavbarUrlItem = {
  label: string;
  url?: string;
  disabled?: boolean;
  soon?: boolean;
};
