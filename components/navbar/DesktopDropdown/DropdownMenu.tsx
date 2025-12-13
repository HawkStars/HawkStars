import { NavbarDropdown } from '@/payload-types';
import { FC } from 'react';
import DesktopDropdownV1 from './DropdownV1';
import DesktopDropdownV2 from './DropdownV2';

type DropdownMenuProps = {
  dropdownInfo?: NavbarDropdown;
};

const DropdownMenu: FC<DropdownMenuProps> = ({ dropdownInfo }) => {
  if (!dropdownInfo) return null;

  if (dropdownInfo.version === 'v1')
    return <DesktopDropdownV1 {...dropdownInfo} key='dropdown-menu-v1' />;
  return <DesktopDropdownV2 {...dropdownInfo} key='dropdown-menu-v2' />;
};

export default DropdownMenu;
