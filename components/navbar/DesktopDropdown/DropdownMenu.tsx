import { NavbarDropdown } from '@/payload-types';
import { FC } from 'react';
import DesktopDropdownV1 from './DropdownV1';

type DropdownMenuProps = {
  dropdownInfo?: NavbarDropdown;
};

const DropdownMenu: FC<DropdownMenuProps> = ({ dropdownInfo }) => {
  if (!dropdownInfo) return null;

  return <DesktopDropdownV1 {...dropdownInfo} key='dropdown-menu-v1' />;
};

export default DropdownMenu;
